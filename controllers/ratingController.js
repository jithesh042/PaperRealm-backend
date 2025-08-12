import Upload from "../models/Upload.js";

export const addOrUpdateRating = async (req, res) => {
  const { uploadId, rate } = req.body;

  try {
    const upload = await Upload.findById(uploadId);
    if (!upload) return res.status(404).json({ message: "Upload not found" });

    const existingIndex = upload.ratings.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingIndex > -1) {
      upload.ratings[existingIndex].rate = rate; // update
    } else {
      upload.ratings.push({ user: req.user._id, rate });
    }

    await upload.save();
    res.json({ message: "Rating saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
