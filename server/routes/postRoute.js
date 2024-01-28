import express from "express";
import { userByID } from "../controllers/userController.js";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  isPoster,
  postByID,
  resizePostPhoto,
  updatePost,
  uploadPostPhoto,
} from "../controllers/postController.js";

const router = express.Router();

router
  .route("/posts/new/:userId")
  .post(protect, uploadPostPhoto, resizePostPhoto, createPost);

router.route("/posts").get(getPosts);

router
  .route("/posts/:postId")
  .get(getPost)
  .put(protect, isPoster, updatePost)
  .delete(protect, isPoster, deletePost);

router.param("userId", userByID);
router.param("postId", postByID);

export default router;
