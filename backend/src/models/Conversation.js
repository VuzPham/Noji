import mongoose from "mongoose";
const pacticipantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jointAt: {
    type: Date,
    default: Date.now,
  },
  _id: false, // Disable automatic _id generation for subdocuments
});
const lastMessageSchema = new mongoose.Schema({
  _id: { type: string }, // Sử dụng _id để lưu messageId của tin nhắn cuối cùng
  content: {
    type: String,
    default: null,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createAt: {
    type: Date,
    default: null,
  },
  _id: false, // Disable automatic _id generation for subdocuments
});

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, // Remove leading/trailing whitespace from group name
    required: true,
  },
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  lastMessageAt: {
    type: Date,
  },
  seenBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  lastMessage: {
    type: [lastMessageSchema],
  },
  _id: false, // Disable automatic _id generation for subdocuments
});

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["private", "group"],
      required: true,
    },
    participants: {
      type: [pacticipantSchema],
      required: true,
    },
    group: {
      type: [groupSchema],
      required: true,
    },
    unreadCounts: {
      type: Map, // Sử dụng Map để lưu số lượng tin nhắn chưa đọc cho từng người tham gia
      of: Number, // Giá trị của Map sẽ là số lượng tin nhắn chưa đọc
      default: {}, // Mặc định là một Map rỗng, sẽ được cập nhật khi có tin nhắn mới hoặc khi người dùng đọc tin nhắn
    },
  },
  {
    timestamps: true, // Tự động tạo các trường createdAt và updatedAt
  },
);
// Tạo index cho trường participants.userId để tối ưu hóa truy vấn tìm kiếm cuộc trò chuyện theo người tham gia
conversationSchema.index({ "participants.userId": 1, lastMessageAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
