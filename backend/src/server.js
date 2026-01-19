import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());
// Public route for testing
app.use("/api/auth", authRoute);

// Private route example
app.use("/api/private", (req, res) => {
  res.status(200).json({ message: "This is a private route" });
});

connectDB().then(() => {
  console.log("Database connected, starting server...");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
