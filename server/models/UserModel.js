import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: [true, "Email already exist."],
    lowercase: true,
    validate: [validator.isEmail],
    trim: true,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password must be confirmed"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same.",
    },
  },
});

export const User = mongoose.model("User", UserSchema);
