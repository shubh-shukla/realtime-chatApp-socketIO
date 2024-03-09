import { Router } from "express";
import {
  accessChat,
  accessGroupChat,
  createGroup,
  FetchChats,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, accessChat);

router.route("/").get(verifyJWT, FetchChats);

router.route("/group").post(verifyJWT, createGroup);

router.route("/group").get(verifyJWT, accessGroupChat);

export default router