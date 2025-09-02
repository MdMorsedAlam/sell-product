import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../public/storage");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
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

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  cb(null, true);
};

export const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

// Use a specific multer handler for the thumbnail
// export const uploadThumbnail = multer({
//   storage: storage,
//   fileFilter: imageFilter, // Only accept image types
//   limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2MB for thumbnail
// }).single("image"); // Field name should match the frontend

export const uploadImages = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
}).array("images", 10);

export const uploadFile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
}).single("file");

export const uploadFiles = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024, files: 10 },
}).array("files", 10);

export const getFileUrl = (filename: string) => {
  return `/storage/${filename}`;
};

export const deleteFile = (filename: string) => {
  const filePath = path.join(__dirname, "../../public/storage", filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
};

// export const deleteFile = async (filename: string): Promise<boolean> => {
//   const filePath = path.join(__dirname, "../../public/storage", filename);

//   try {
//     await fs.promises.unlink(filePath);
//     return true;
//   } catch (error) {
//     if (error.code === 'ENOENT') {
//       // File doesn't exist
//       return false;
//     }
//     throw error; // Re-throw other errors
//   }
// };

// Add this to fileHandler.ts
export const uploadEpaperFiles = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "file") {
      // Allow images and PDF for main file
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "application/pdf"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Main file must be image (PNG/JPG/JPEG) or PDF"));
      }
    } else if (file.fieldname === "thumbnail") {
      // Only allow images for thumbnail
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Thumbnail must be an image (PNG/JPG/JPEG)"));
      }
    } else {
      cb(new Error("Unexpected field"));
    }
  },
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per file
    files: 2, // Allow 2 files (file + thumbnail)
  },
}).fields([
  { name: "file", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

export const handleUploadError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "File upload failed",
    });
  }
  next();
};

// Add to fileHandlers.ts
export const uploadEntertainmentFiles = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "thumbnail") {
      // Only images for thumbnail
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Thumbnail must be an image (PNG, JPG, JPEG)"));
      }
    } else if (file.fieldname === "media") {
      // Allow videos and other media types
      if (
        file.mimetype.startsWith("video/") ||
        file.mimetype.startsWith("audio/")
      ) {
        cb(null, true);
      } else {
        cb(new Error("Media must be video or audio"));
      }
    } else {
      cb(new Error("Unexpected field"));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1024MB (GB)
    files: 2,
  },
}).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "media", maxCount: 1 },
]);
