import express from "express";
import { authMe } from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Sample private route for user data
router.get("/me", authMe);

export default router;
