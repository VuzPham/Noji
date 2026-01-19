import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes:
// req, res, next
// next: hàm callback để chuyển quyền điều khiển sang middleware tiếp theo
export const protectRoute = (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    // example header Bearer <token>
    // => ['Bearer', '<token>'][1] => token
    const token = authHeader.split(" ")[1]; // Lấy token sau "Bearer "
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.log("JWT verification error:", err);
          return res
            .status(401)
            .json({ message: "Unauthorized: Invalid token" });
        }
        // find user
        const user = await User.findById(decodedUser.userId).select(
          "-password",
        );
        if (!user) {
          return res
            .status(401)
            .json({ message: "Unauthorized: User not found" });
        }
        // Token is valid, attach user info to request object
        req.user = user;
        next(); // Chuyển quyền điều khiển sang middleware tiếp theo
      },
    );
  } catch (error) {
    console.log("Error in protectRoute:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
