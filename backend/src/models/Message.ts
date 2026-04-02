import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
    },
  },
  { timestamps: true },
);
// Create a compound index on conversationId and createAt for efficient querying of messages in a conversation
// Sort messages by createAt in descending order to get the latest messages first
messageSchema.index({ conversationId: 1, createdAt: -1 }); // Tin nhắn mới nhất sẽ được ưu tiên hiển thị trước
const Message = mongoose.model("Message", messageSchema); // Tạo model Message từ schema và xuất ra để sử dụng trong các phần khác của ứng dụng
export default Message;
