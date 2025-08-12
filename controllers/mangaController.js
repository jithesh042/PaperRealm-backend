// controllers/mangaController.js
import Manga from '../models/Upload.js';


export const getAllManga = async (req, res) => {
  try {
    const mangaList = await Manga.find({ type: 'manga' }).lean();
    res.json(mangaList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllManhwa = async (req, res) => {
  try {
    const manhwaList = await Manga.find({ type: 'manhwa' }).lean();
    res.json(manhwaList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMangaById = async (req, res) => {
  const { id } = req.params;
  const item = await Manga.findById(id).lean();
  if (!item) return res.status(404).json({ message: 'Not found' });

  // Suppose chapters PDF is stored as array of buffers per chapter,
  // or you simply track a count field:
  const chaptersCount = item.chaptersArray?.length || 1;

  res.json({ ...item, chaptersCount });
};


export const getChapterPdf = async (req, res) => {
  const { id, chapterNum } = req.params;
  const item = await Manga.findById(id);
  if (!item) return res.status(404).json({ message: 'Not found' });

  // If you stored an array of PDFs:
  const pdfBuffer = item.chaptersArray[chapterNum - 1];
  if (!pdfBuffer) return res.status(404).json({ message: 'Chapter not found' });

  res.set('Content-Type', 'application/pdf');
  res.send(pdfBuffer);
};
