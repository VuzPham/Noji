import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
  userA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamps: true, // Tự động tạo các trường createdAt và updatedAt
});

// Middleware để đảm bảo rằng userA luôn có ObjectId nhỏ hơn userB trước khi lưu vào cơ sở dữ liệu
friendSchema.pre("save", async function (next) {
  const a = this.userA.toString();
  const b = this.userB.toString();
  if (a > b) {
    this.userA = new mongoose.Types.ObjectId(b);
    this.userB = new mongoose.Types.ObjectId(a);
  }
  next();
});
// Đảm bảo rằng mỗi cặp bạn bè chỉ tồn tại một lần trong cơ sở dữ liệu
friendSchema.index({ userA: 1, userB: 1 }, { unique: true });
const Friend = mongoose.model("Friend", friendSchema);
export default Friend;
