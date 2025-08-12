import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploadId: { type: mongoose.Schema.Types.ObjectId, ref: "Upload", required: true },
    chapterNumber: { type: Number, default: null },
    reason: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
