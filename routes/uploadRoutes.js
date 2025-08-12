import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  createUpload,
  getAllUploads,
  getLatestUploads,
  getTopRatedUploads,
  getUploadById,
  getUserUploads,
  getChapterByNumber,
  addChapter,
  deleteUpload,
  deleteChapter
} from "../controllers/uploadController.js";
import Upload from "../models/Upload.js";

const router = express.Router();

// Upload creation
router.post(
  "/",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "chapter", maxCount: 1 },
  ]),
  createUpload
);

// Add chapter
router.post(
  "/:id/chapter",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 }
  ]),
  addChapter
);

// Update upload
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  const upload = await Upload.findById(req.params.id);
  if (!upload) return res.status(404).json({ message: "Upload not found" });
  if (!canDelete(upload, req.user)) return res.status(403).json({ message: "Not authorized" });

  upload.title = req.body.title || upload.title;
  upload.author = req.body.author || upload.author;
  upload.genre = req.body.genre || upload.genre;
  upload.description = req.body.description || upload.description;

  if (req.file) {
    deleteFileIfExists(upload.image);
    upload.image = req.file.filename;
  }

  await upload.save();
  res.json(upload);
});

// Read routes
router.get("/", getAllUploads);
router.get("/my-uploads", protect, getUserUploads);
router.get("/latest", getLatestUploads);
router.get("/top", getTopRatedUploads);
router.get("/:id", getUploadById);
router.get("/:id/chapter/:number", getChapterByNumber);
router.delete("/:id", protect, deleteUpload);
router.delete("/:uploadId/chapter/:chapterId", protect, deleteChapter);

export default router;
