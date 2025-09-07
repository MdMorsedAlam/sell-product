import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uploadPath = path.join(__dirname, "../../public/storage");

    // Ensure the folder exists or create it
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // Create a unique name for the file using UUID
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  console.log("File MIME type:", file.fieldname, file.filename);
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};
// Define the upload for the main product image (single file)
export const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("imageUrl");
// Define the upload for multiple review images (multiple files)
export const uploadReviews = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // Limit to 5MB per file, up to 5 review images
}).array("reviews", 5); // 'reviews' should match the field name in the frontend input

export const uploadProductImages = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "imageUrl") {
      // Allow images for the main product image (imageUrl)
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Main file must be image (PNG/JPG/JPEG)"));
      }
    } else if (file.fieldname === "reviews") {
      // Allow multiple review images
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Review images must be in PNG/JPG/JPEG format"));
      }
    } else {
      cb(new Error("Unexpected field"));
    }
  },
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per file for both product image and review images
    files: 6, // Allow 1 product image and up to 5 review images
  },
}).fields([
  { name: "imageUrl", maxCount: 1 }, // Single product image
  { name: "reviews", maxCount: 5 }, // Allow up to 5 review images
]);

// Helper to get the file URL
export const getFileUrl = (filename: string) => {
  return `/storage/${filename}`; // Assuming static files are served from '/storage' directory
};

// Middleware to handle errors for file upload
export const handleUploadError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    // Handle specific Multer errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message:
          "File size exceeds the limit. Max size is 10MB for product image and 5MB for review images.",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files uploaded. Only 5 review images are allowed.",
      });
    }

    // Other multer-specific errors (e.g., file type issues)
    return res.status(400).json({
      success: false,
      message: `Multer Error: ${err.message}`,
    });
  } else if (err) {
    // General error handler for non-multer errors
    return res.status(500).json({
      success: false,
      message: err.message || "File upload failed",
    });
  }
  next();
};
