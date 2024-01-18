import express from "express";

import {
  resizeUserPhoto,
  signin,
  signup,
  uploadUserPhoto,
} from "../controllers/authController.js";
import { userByID } from "../controllers/userController.js";

const router = express.Router();

router.route("/auth/signup").post(uploadUserPhoto, resizeUserPhoto, signup);

router.route("/auth/signin").post(signin);

router.param("userId", userByID);

export default router;
