import express from "express";
import { signOut, signUp, signIn } from "../controllers/authController.js";

const router = express.Router();

// Sample public route for authentication
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

export default router;
