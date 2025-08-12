import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addOrUpdateRating } from "../controllers/ratingController.js";

const router = express.Router();

router.post("/", protect, addOrUpdateRating);

export default router;
