import { Router } from "express";
import {
  signupUser,
  loginUser,
  authCheck,
} from "../controllers/userController.js";

const router = Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/auth", authCheck);

export default router;
