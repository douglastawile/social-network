import { User } from "../models/UserModel.js";

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
