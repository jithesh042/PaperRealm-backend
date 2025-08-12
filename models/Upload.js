import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  chapterNumber: Number,
  chapterTitle: String,
  pdfFile: String, // stored filename/path
});

const uploadSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true, enum: ["manga", "manhwa", "novel"] },
    title: { type: String, required: true },
    image: { type: String }, // cover image filename
    genres: [{ type: String }],
    author: { type: String },
    description: { type: String },
    ratings: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rate: { type: Number, min: 1, max: 5 }
  }
],
    chapters: [chapterSchema], // array of uploaded chapters
  },
  { timestamps: true }
);

export default mongoose.model("Upload", uploadSchema);
