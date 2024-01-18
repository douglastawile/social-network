import jwt from "jsonwebtoken";
import { promisify } from "util";
import multer from "multer";
import sharp from "sharp";

import { User } from "../models/UserModel.js";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(res.status(401).json({ error: "Please upload only images." }), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user?._id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    //Check for all fields are entered by the user
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(422).json({ error: "All fields are required." });
    }

    //Check if password is less than 8
    if (password && password.length < 8) {
      return res
        .status(422)
        .json({ error: "Password must be at least 8 characters long." });
    }

    //Check if the password is the same as the password confirm
    if (password !== passwordConfirm) {
      return res.status(422).json({ error: "Passwords are not the same." });
    }

    //Check if user with email already exist.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(422)
        .json({ error: "User with this email already exist." });
    }

    //Save user to the database if all fields passes
    const newUser = new User({ name, email, password, passwordConfirm });
    if (req.file) newUser.photo = req.file.filename;
    await newUser.save();
    res.status(201).json({
      status: "Success",
      message: "User account created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(422)
        .json({ error: "Please provide email and password." });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email, photo: user.photo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRE_IN }
    );

    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE_IN * 24 * 60 * 60 * 100
      ),
    });

    res.status(200).json({
      status: "Success",
      message: "User successfully signed in.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Internal server error" });
  }
};

// Protecting Users Route
export const protect = async (req, res, next) => {
  try {
    //Getting token and check if it is there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res
        .status(401)
        .json({ error: "You are not logged in. Please login to get access" });
    }

    // Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //Check if user still exist
    const currentUser = await User.findById(decoded._id);
    if (!currentUser) {
      return res.status(401).json({
        error: "The user belonging to this token does no longer exist",
      });
    }

    //Grant access to the protected route
    req.user = currentUser;
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Internal server error" });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    const isAuthorized =
      req.profile &&
      req.user &&
      req.profile._id.toString() === req.user._id.toString();
    if (!roles.includes(req.user.role) || !isAuthorized) {
      return res.status(403).json({
        error:
          "Acces denied. You donot have permission to perform this action.",
      });
    }

    next();
  };
};
