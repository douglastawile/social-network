import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  resizeUserPhoto,
  updateUser,
  uploadUserPhoto,
  userByID,
} from "../controllers/userController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

router.route("/users").get(getUsers);

router
  .route("/users/:userId")
  .get(protect, getUser)
  .patch(
    protect,
    restrictTo("user"),
    uploadUserPhoto,
    resizeUserPhoto,
    updateUser
  )
  .delete(protect, restrictTo("user"), deleteUser);

router.param("userId", userByID);

export default router;
