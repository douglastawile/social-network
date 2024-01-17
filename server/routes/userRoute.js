import express from "express";
import { getUsers, userByID } from "../controllers/userController.js";

const router = express.Router();

router.route("/users").get(getUsers);

router.param("userId", userByID);

export default router;
