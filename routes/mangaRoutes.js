// routes/mangaRoutes.js
import express from 'express';
import { getMangaById, getChapterPdf ,getAllManga, getAllManhwa } from '../controllers/mangaController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/manga', getAllManga);
router.get('/manga/:id', getMangaById);
router.get('/manga/:id/chapter/:chapterNum', getChapterPdf);
router.get('/manhwa',getAllManhwa);

export default router;
