import express from "express";
import {
  addFollower,
  addFollowing,
  deleteUser,
  findPeople,
  getUser,
  getUsers,
  removeFollower,
  removeFollowing,
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

router.route("/users/follow").put(protect, addFollowing, addFollower);

router.route("/users/unfollow").put(protect, removeFollowing, removeFollower);

router.route("/users/findpeople/:userId").get(protect, findPeople);

router.param("userId", userByID);

export default router;
