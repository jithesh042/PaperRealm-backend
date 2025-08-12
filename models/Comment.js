import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploadId: { type: mongoose.Schema.Types.ObjectId, ref: "Upload", required: true },
    chapterNumber: { type: Number, default: null }, // null = main upload comment
    text: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
