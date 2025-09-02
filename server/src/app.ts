import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import modulesRoutes from "./app/routes";
import path from "path";

const app: Application = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Increase the limit for JSON and URL-encoded bodies to handle large payloads
app.use(express.json({ limit: "10mb" })); // Increase JSON body limit to 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase URL-encoded body limit to 10MB

// Serve static files (e.g., images) from the "storage" folder
app.use("/storage", express.static(path.join(__dirname, "../public/storage")));

// Use your API routes
app.use("/api/v1", modulesRoutes);

// Global error handler
app.use(globalErrorHandler);

// Handle API not found (404 errors)
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API not found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API not found",
      },
    ],
  });
});

export default app;
