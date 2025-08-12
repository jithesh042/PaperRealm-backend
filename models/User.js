import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    favoriteGenres: [{ type: String }],
    profilePhoto: { type: String }, // filename or URL
    role: { type: String, default: "customer", enum: ["customer", "admin"] },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
