import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m"; // access token time to live
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // refresh token time to live in milliseconds (14 days)

export const signUp = async (req, res) => {
  try {
    // Extract user data from request body
    const { username, email, password, firstname, lastname } = req.body;
    if (!username || !email || !password || !firstname || !lastname) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing user
    const duplicateUser = await User.findOne({
      $or: [{ username }, { email }], // Check if either username or email exists
    });
    if (duplicateUser) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    // Bcrypt password
    // salt rounds: số lần bcrypt thực hiện mã hóa lặp đi lặp lại
    // Tạo ra chuỗi ngẫu nhiên (muối) trộn với password gốc mã hóa nhiều vòng
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds
    // 2^10: 1024 lần mã hóa lặp => càng chậm hacker càng khó tấn công brute-force

    // Create new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      displayName: `${firstname} ${lastname}`,
    });
    await newUser.save();
    // Successfully create new user
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        displayName: newUser.displayName,
      },
    });
  } catch (error) {
    console.log("Error in signUp:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const signIn = async (req, res) => {
  try {
    // Input
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // hash password_db compare password_input
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User is not invalid" });
    }
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password is incorrect" });
    }
    // True: create accessToken với JWT
    // accessToken secret
    const accessToken = jwt.sign(
      // payload, secret, options
      { userId: user._id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }, // thời gian sống của access token
    );
    // Create refresh token
    // Lưu trong db hoặc trong bộ nhớ đệm (redis)
    const refreshToken = crypto.randomBytes(64).toString("hex"); // 128 chars
    // create session save refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expireAt: new Date(Date.now() + REFRESH_TOKEN_TTL), // hiện tại + 14 ngày (Time to live)
    });

    // gửi refresh token về client dưới dạng httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // client-side script ko truy cập đc
      secure: true, // chỉ gửi cookie qua kết nối HTTPS
      sameSite: "strict", //Cookie chỉ được gửi khi request xuất phát từ cùng domain (CSRF)
      maxAge: REFRESH_TOKEN_TTL, // thời gian sống của cookie
    });

    return res.status(200).json({ message: "Sign-in successful", accessToken });
    // Response access token về client
  } catch (error) {
    console.log("Error in signIn:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signOut = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token not found" });
    }
    // Delete session from database
    await Session.deleteOne({ refreshToken });
    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.sendStatus(204);
  } catch (error) {
    console.log("Error in logOut:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
