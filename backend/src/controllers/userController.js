export const authMe = async (req, res) => {
  try {
    // Since the protectRoute middleware attaches the user to req,
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    });
  } catch (error) {
    console.log("Error in authMe:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
