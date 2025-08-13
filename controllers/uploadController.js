import Upload from "../models/Upload.js";
import fs from "fs";
import path from "path";
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

export const createUpload = async (req, res) => {
  try {
    const { type, title, genres, author, description } = req.body;

    const newUpload = await Upload.create({
      user: req.user._id,
      type,
      title,
      genres: genres ? genres.split(",") : [],
      author,
      description,
      image: req.files["image"]?.[0]
        ? `${BASE_URL}/uploads/${req.files["image"][0].filename}`
        : null,
      chapters: [
        {
          chapterNumber: 1,
          chapterTitle: title,
          pdfFile: req.files["chapter"]?.[0]
            ? `${BASE_URL}/uploads/${req.files["chapter"][0].filename}`
            : null,
        },
      ],
    });

    res.status(201).json(newUpload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addChapter = async (req, res) => {
  try {
    const { chapterNumber, chapterTitle } = req.body;

    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ message: "Upload not found" });

    // Optional: prevent duplicate chapter numbers
    if (upload.chapters.some(c => c.chapterNumber === Number(chapterNumber))) {
      return res.status(400).json({ message: "Chapter number already exists" });
    }

   upload.chapters.push({
  chapterNumber: Number(chapterNumber),
  chapterTitle,
  pdfFile: req.files["pdfFile"]?.[0]
    ? `${BASE_URL}/uploads/${req.files["pdfFile"][0].filename}`
    : null,
  image: req.files["image"]?.[0]
    ? `${BASE_URL}/uploads/${req.files["image"][0].filename}`
    : null,
});

    await upload.save();
    res.status(201).json(upload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getUserUploads = async (req, res) => {
  try {

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const uploads = await Upload.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(uploads);
  } catch (err) {
    console.error("Error in getUserUploads:", err.stack || err);
    res.status(500).json({ message: err.message });
  }
};





export const getAllUploads = async (req, res) => {
  const { type, genres } = req.query;

  let filter = {};
  if (type) filter.type = type;
  if (genres) filter.genres = { $in: genres.split(",") };

  try {
    const uploads = await Upload.find(filter).populate("user", "name");
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLatestUploads = async (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    const uploads = await Upload.find({ createdAt: { $gte: oneWeekAgo } })
      .sort({ createdAt: -1 })
      .populate("user", "name");
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTopRatedUploads = async (req, res) => {
  try {
    const uploads = await Upload.aggregate([
      {
        $addFields: {
          avgRating: { $avg: "$ratings.rate" }
        }
      },
      { $sort: { avgRating: -1 } },
      { $limit: 10 }
    ]);
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// GET /api/upload/:id
export const getUploadById = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id)
      .populate("user", "name")
      .lean();

    if (!upload) return res.status(404).json({ message: "Not found" });

    res.json(upload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/upload/:id/chapter/:number
export const getChapterByNumber = async (req, res) => {
  try {
    const { id, number } = req.params;
    const upload = await Upload.findById(id).lean();
    if (!upload) return res.status(404).json({ message: "Not found" });

    const chapter = upload.chapters.find(
      (c) => c.chapterNumber === Number(number)
    );
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });

    res.json(chapter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteFileIfExists = (filePath) => {
  try {
    if (!filePath) return;
    const fullPath = path.join(process.cwd(), "uploads", filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted file: ${fullPath}`);
    } else {
      console.log(`File not found, skipping delete: ${fullPath}`);
    }
  } catch (err) {
    console.error(`Error deleting file (${filePath}):`, err.message);
  }
};
export const deleteUpload = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ message: "Upload not found" });

    if (upload.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete cover image
    deleteFileIfExists(path.join("images", upload.image));

    // Delete each chapter file
    upload.chapters.forEach(chap => {
      deleteFileIfExists(path.join("chapters", chap.pdfFile));
    });

    await upload.deleteOne();
    res.json({ message: "Upload deleted successfully" });
  } catch (err) {
    console.error("Delete upload error:", err.stack || err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteChapter = async (req, res) => {
  try {
    const { uploadId, chapterId } = req.params;

    // 1️⃣ Find the parent upload
    const upload = await Upload.findById(uploadId);
    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }

    // 2️⃣ Ensure the requesting user owns this upload
    if (upload.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 3️⃣ Get the chapter as a subdocument
    const chapter = upload.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    // 4️⃣ Delete the PDF file from disk
    deleteFileIfExists(path.join("chapters", chapter.pdfFile));

    // 5️⃣ Remove the subdocument
    chapter.deleteOne(); // or .remove() if Mongoose < 7

    // 6️⃣ Save the parent document
    await upload.save();

    res.json({ message: "Chapter deleted successfully" });

  } catch (err) {
    console.error("Delete chapter error:", err.stack || err);
    res.status(500).json({ message: err.message });
  }
};
