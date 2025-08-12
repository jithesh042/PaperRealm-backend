// routes/chapterRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "images") {
      cb(null, "uploads/chapters/images");
    } else if (file.fieldname === "pdf") {
      cb(null, "uploads/chapters/pdfs");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

router.post(
  "/",
  protect,
  upload.fields([{ name: "images", maxCount: 20 }, { name: "pdf", maxCount: 1 }]),
  async (req, res) => {
    const { chapterTitle, number, uploadId } = req.body;
    // Save to DB logic here...
    res.json({ message: "Chapter uploaded successfully" });
  }
);

export default router;
