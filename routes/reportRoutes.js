import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createReport } from "../controllers/reportController.js";

const router = express.Router();

router.post("/", protect, createReport); // report upload or chapter

export default router;
