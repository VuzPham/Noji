import express from "express";

const router = express.Router();

// Sample private route for user data
router.post("/me", authMe);

export default router;
