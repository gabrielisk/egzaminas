import { Router } from "express";
import { signupUser } from "../controllers/userController.js";

const router = Router();
router.post("/signup", signupUser);

export default router;
