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

//Getting user by ID
export const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    req.profile = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Feching all users from the database
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single user from the database
export const getUser = async (req, res) => {
  try {
    const user = req.profile;
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update and save user info to the database
const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateUser = async (req, res) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return res
        .status(422)
        .json({ error: "This route is not for password update." });
    }

    const filteredBody = filteredObj(req.body, "name", "email", "about");
    if (req.file) filteredBody.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(
      req.profile._id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "Success",
      message: "User account updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Removing user information from the database
export const deleteUser = async (req, res) => {
  try {
    const user = req.profile;
    await User.findByIdAndDelete({ _id: user._id });
    res.status(200).json({
      status: "Success",
      message: "User account deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
