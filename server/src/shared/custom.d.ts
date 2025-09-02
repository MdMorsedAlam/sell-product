import { Request } from "express";
import { UploadedFile } from "express-fileupload"; // If using fileupload

declare global {
  namespace Express {
    export interface Request {
      file: Express.Multer.File; // Add multer file type here
    }
  }
}
