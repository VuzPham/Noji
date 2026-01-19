import express from "express";
import { signUp } from "../controllers/authController.js";

const router = express.Router();

// Sample public route for authentication
router.post("/signup", signUp);

export default router;
