import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import cookieParser from "cookie-parser";
import { protectRoute } from "./middleware/authMiddleware.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
dotenv.config();

// Open port for the server, default to 5000 if not specified in environment variables
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Allow CORS for frontend development
// Public route for testing
app.use("/api/auth", authRoute);

// Private route example
app.use(protectRoute); // Middleware to protect routes
app.use("/api/users", userRoute);

connectDB().then(() => {
  console.log("Database connected, starting server...");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
