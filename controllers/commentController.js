import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  const { uploadId, chapterNumber, text } = req.body;

  try {
    const newComment = await Comment.create({
      user: req.user._id,
      uploadId,
      chapterNumber,
      text,
    });
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getComments = async (req, res) => {
  const { uploadId, chapterNumber } = req.query;

  let filter = { uploadId };
  if (chapterNumber) filter.chapterNumber = chapterNumber;
  else filter.chapterNumber = null; // main page comments

  try {
    const comments = await Comment.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name profilePhoto");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
