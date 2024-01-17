import express from "express";
import { getUser, getUsers, userByID } from "../controllers/userController.js";

const router = express.Router();

router.route("/users").get(getUsers);

router.route("/users/:userId").get(getUser);

router.param("userId", userByID);

export default router;
