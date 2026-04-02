import express from "express";
import {
  signOut,
  signUp,
  signIn,
  refreshToken,
} from "../controllers/authController.js";

const router = express.Router();

// Sample public route for authentication
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/refresh", refreshToken);
export default router;
