import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

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
    select: false,
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

//Making the password hash with bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  //Hash the password
  const saltRound = 12;
  const salt = await bcrypt.genSalt(saltRound);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});

export const User = mongoose.model("User", UserSchema);
