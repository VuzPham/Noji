import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      maxlength: 300,
    },
  },
  { timestamps: true },
);

friendRequestSchema.index({ from: 1, to: 1 }, { unique: true }); // Đảm bảo rằng mỗi cặp yêu cầu kết bạn chỉ tồn tại một lần trong cơ sở dữ liệu
friendRequestSchema.index({ to: 1 }); // Tạo index cho trường "to" để tối ưu hóa truy vấn tìm kiếm yêu cầu kết bạn đến một người dùng cụ thể
friendRequestSchema.index({ from: 1 }); // Tạo index cho trường "from" để tối ưu hóa truy vấn tìm kiếm yêu cầu kết bạn từ một người dùng cụ thể
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;
