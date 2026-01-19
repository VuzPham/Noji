import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensure user have index
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      // link CDN to dislay Image
      type: String,
    },
    avatarId: {
      // Cloudinary public_id để xóa hình
      type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    phoneNumber: {
      type: String,
      sparse: true, // Allow multiple null values
    },
  },
  { timestamps: true } // auto generate createdAt and updatedAt fields
);

const User = mongoose.model("User", userSchema);
export default User;
