import multer from "multer";

// Set up multer storage
const storage = multer.memoryStorage(); // Store files in memory buffer

// Configure multer
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
}).array("images"); // Accept multiple files with the key 'images'