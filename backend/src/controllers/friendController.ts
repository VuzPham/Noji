import Friend from "../models/Friend.js";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

// Send a friend request from the authenticated user to another user
export const sendFriendRequest = async (req, res) => {
  try {
    // to is the "ID" of the user to whom the friend request is being sent
    const { to, message } = req.body;
    const from = req.user._id;
    if (from.toString() === to) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    }
    // Check if the recipient user exists
    const userExist = await User.exists({ _id: to });
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a friend request already exists between the two users
    let userA = from.toString();
    let userB = to.toString();
    // Ensure userA is always the smaller ID to maintain consistency in the Friend collection
    if (userA > userB) {
      // destructuring assignment (gán phá cấu trúc) để hoán đổi giá trị của userA và userB nếu userA có ID lớn hơn userB
      [userA, userB] = [userB, userA];
    }

    // Use Promise.all to perform both queries in parallel for better performance
    const [alreadyFriends, existingRequest] = await Promise.all([
      // Check if they are already friends
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          // TH1: A gửi cho B
          { from, to },
          // TH2: B gửi cho A
          { from: to, to: from },
        ],
      }),
    ]);
    if (alreadyFriends) {
      return res.status(400).json({ message: "You are already friends" });
    }
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    // If no existing friend request or friendship exists, create a new friend request
    // Create a new friend request
    const friendRequest = new FriendRequest({
      from,
      to,
      message,
    });
    return res.status(201).json({
      message: "Friend request sent successfully",
      friendRequest,
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res
      .status(500)
      .json({ message: "An error occurred while sending friend request" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res
      .status(500)
      .json({ message: "An error occurred while accepting friend request" });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error declining friend request:", error);
    res
      .status(500)
      .json({ message: "An error occurred while declining friend request" });
  }
};

export const getAllFriends = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error fetching all friends:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching all friends" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching friend requests" });
  }
};
