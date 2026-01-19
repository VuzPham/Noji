import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User model
      required: true,
      index: true,
    },
    refreshToken: { type: String, required: true, unique: true },
    expireAt: { type: Date, required: true }, // TTL index
  },
  { timestamps: true }
);
// tự động xóa khi hết hạn
// expireAt + 0s => ngay khi đến thời gian expireAt sẽ bị xóa
sessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
const Session = mongoose.model("Session", sessionSchema);
export default Session;
