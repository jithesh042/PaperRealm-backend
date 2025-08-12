import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// routes
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import mangaRoutes from "./routes/mangaRoutes.js"

dotenv.config();
const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); // for parsing json bodies
import userRoutes from "./routes/userRoutes.js";
app.use("/api/users", userRoutes);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static("uploads")); 
app.use("/api/comments", commentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ratings", ratingRoutes);
app.use('/api/content', mangaRoutes);

import contentRoutes from'./routes/contentRoutes.js';
app.use('/api/content', contentRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("PaperRealm backend is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
