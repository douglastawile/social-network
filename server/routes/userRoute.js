import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  userByID,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/users").get(getUsers);

router
  .route("/users/:userId")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

router.param("userId", userByID);

export default router;
