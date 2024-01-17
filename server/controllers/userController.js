import { User } from "../models/UserModel.js";

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

    const filteredBody = filteredObj(req.body, "name", "email");
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
