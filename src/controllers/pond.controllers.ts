import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import ErrorHandler from "../utils/utility-class";

// Directory where images are stored
const CAPTURES_DIR = path.join(__dirname, "../../captures");

// Ensure the folder exists
if (!fs.existsSync(CAPTURES_DIR)) {
  fs.mkdirSync(CAPTURES_DIR, { recursive: true });
}

/**
 * Upload images for a specific pond.
 */
export const uploadImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pondName } = req.body;

    if (!pondName) {
      return next(new ErrorHandler("Pond name is required", 400));
    }

    // Ensure pond-specific folder exists
    const pondFolder = path.join(CAPTURES_DIR, pondName);
    if (!fs.existsSync(pondFolder)) {
      fs.mkdirSync(pondFolder, { recursive: true });
    }

    // Save uploaded files
    const uploadedFiles = (req.files as Express.Multer.File[]) || [];
    if (uploadedFiles.length === 0) {
      return next(new ErrorHandler("No files uploaded", 400));
    }

    uploadedFiles.forEach((file) => {
      const targetPath = path.join(pondFolder, file.originalname);
      fs.writeFileSync(targetPath, file.buffer);
    });

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      files: uploadedFiles.map((file) => file.originalname),
    });
  } catch (error: any) {
    next(new ErrorHandler(`Failed to upload images: ${error.message}`, 500));
  }
};

/**
 * Get all images for a specific pond.
 */
export const getImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pondName } = req.body;

    if (!pondName) {
      return next(new ErrorHandler("Pond name is required", 400));
    }

    const pondFolder = path.join(CAPTURES_DIR, pondName);

    // Check if pond folder exists
    if (!fs.existsSync(pondFolder)) {
      return next(new ErrorHandler("Pond does not exist", 404));
    }

    // Get list of images
    const images = fs.readdirSync(pondFolder);
    res.status(200).json({
      success: true,
      images,
    });
  } catch (error: any) {
    next(new ErrorHandler(`Failed to retrieve images: ${error.message}`, 500));
  }
};