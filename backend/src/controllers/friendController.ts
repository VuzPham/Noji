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
    await friendRequest.save();
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
    // requestId is the "ID" of the friend request being accepted
    const { requestId } = req.params;
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    // Userid trong request body chính là người đang đăng nhập
    const userId = req.user._id;
    // chỉ có người nhận yêu cầu kết bạn mới có quyền chấp nhận yêu cầu đó
    // , nếu người gửi cố gắng chấp nhận yêu cầu của chính mình thì sẽ bị từ chối với mã lỗi 403 (Forbidden)
    if (request.to.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to accept this friend request",
      });
    }
    // Create a new friendship in the Friend collection
    const friend = await Friend.create({
      userA: request.from,
      userB: request.to,
    });
    // Delete the friend request after accepting it
    await FriendRequest.findByIdAndDelete(requestId);
    // Lấy thông tin của người gửi yêu cầu kết bạn để trả về cho client,
    // giúp client có thể hiển thị thông tin bạn bè mới một cách đầy đủ
    // lean: trả về một đối tượng JavaScript thuần túy thay vì một tài liệu Mongoose, giúp cải thiện hiệu suất khi bạn chỉ cần dữ liệu mà không cần các phương thức của Mongoose
    const from = await User.findById(request.from)
      .select("_id displayName username avatarUrl")
      .lean();
    return res.status(200).json({
      message: "Friend request accepted successfully",
      friend: {
        _id: from._id,
        displayName: from.displayName,
        username: from.username,
        avatarUrl: from.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res
      .status(500)
      .json({ message: "An error occurred while accepting friend request" });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const UserId = req.user._id;
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    if (request.to.toString() !== UserId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to decline this friend request",
      });
    }
    await FriendRequest.findByIdAndDelete(requestId);
    return res.status(204);
  } catch (error) {
    console.error("Error declining friend request:", error);
    res
      .status(500)
      .json({ message: "An error occurred while declining friend request" });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    // { userA: 1, userB: 2 },
    // { userA: 1, userB: 3 },
    // { userA: 4, userB: 1 }
    // Lấy tất cả các mối quan hệ bạn bè từ collection Friend
    const friendship = await Friend.find({
      // $or là toán tử logic trong MongoDB cho phép bạn kết hợp nhiều điều kiện truy vấn và trả về các tài liệu thỏa
      $or: [{ userA: req.user._id }, { userB: req.user._id }],
    })
      // populate là phương thức của Mongoose cho phép bạn tự động thay thế các trường tham chiếu (reference fields) trong tài liệu bằng dữ liệu thực tế từ các tài liệu khác.
      // Trong trường hợp này, chúng ta đang sử dụng populate để lấy thông tin chi tiết của userA và userB từ collection User dựa trên ObjectId được lưu trong collection Friend.
      .populate("userA", "displayName username avatarUrl") // populate thông tin userA (chỉ lấy displayName, username và avatarUrl)
      .populate("userB", "displayName username avatarUrl") // populate thông tin userB (chỉ lấy displayName, username và avatarUrl)
      .lean(); // lean để trả về đối tượng JavaScript thuần túy thay vì tài liệu Mongoose, giúp cải thiện hiệu suất khi bạn chỉ cần dữ liệu mà không cần các phương thức của Mongoose

    if (!friendship.length) {
      return res.status(200).json({ friends: [] });
    }
    const friends = friendship.map((f) =>
      // Xác định friend là userA hay userB dựa trên ID của người dùng hiện tại (req.user._id)
      // Nếu userA có ID trùng với ID của người dùng hiện tại, thì friend sẽ là userB, ngược lại friend sẽ là userA
      f.userA._id.toString() === userId.toString() ? f.userB : f.userA,
    );

    return res.status(200).json({ friends });
  } catch (error) {
    console.error("Error fetching all friends:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching all friends" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const [sent, received] = await Promise.all([
      // Lấy tất cả các yêu cầu kết bạn đã gửi bởi người dùng hiện tại
      FriendRequest.find({ from: userId })
        .populate("from", "displayName username avatarUrl")
        .lean(),
      // Lấy tất cả các yêu cầu kết bạn đã nhận bởi người dùng hiện tại
      FriendRequest.find({ to: userId })
        .populate("to", "displayName username avatarUrl")
        .lean(),
    ]);
    return res.status(200).json({ sent, received });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching friend requests" });
  }
};
