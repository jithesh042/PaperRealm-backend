import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  const { uploadId, chapterNumber, reason } = req.body;

  try {
    const newReport = await Report.create({
      user: req.user._id,
      uploadId,
      chapterNumber,
      reason,
    });

    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
