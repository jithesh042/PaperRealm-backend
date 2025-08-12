// routes/contentRoutes.js
import express from 'express';
const router = express.Router();
import Content from '../models/Upload.js'; // Adjust path as needed


// GET /api/content/filter?genres=Action,Romance
router.get('/filter', async (req, res) => {
  const { genres } = req.query;

  try {
    const genreArray = genres?.split(',') || [];

    const query = genreArray.length > 0 ? { genres: { $in: genreArray } } : {};

    const filtered = await Content.find(query);
    res.json(filtered);
  } catch (err) {
    console.error('Filter error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get('/novel', async (req, res) => {
  try {
    const novels = await Content.find({ type: 'novel' });
    res.json(novels);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/:type', async (req, res) => {
  try {
    const type = req.params.type;
    const validTypes = ['manga', 'manhwa', 'novel'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid content type' });
    }

    const uploads = await Content.find({ type });
    res.json(uploads);
  } catch (error) {
    console.error('Error fetching uploads:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
