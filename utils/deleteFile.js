import fs from "fs";
import path from "path";

export const deleteFile = (filePath) => {
  try {
    if (filePath) {
      const fullPath = path.join(process.cwd(), "uploads", filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted file: ${fullPath}`);
      }
    }
  } catch (err) {
    console.error("Error deleting file:", err);
  }
};
