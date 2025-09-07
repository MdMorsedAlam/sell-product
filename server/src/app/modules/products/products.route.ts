import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ProductsController } from "./products.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { uploadImages } from "../../../helpers/fileHandlers";
import {
  uploadImage,
  uploadProductImages,
  uploadReviews,
} from "../../../helpers/imageUploadMiddleware";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN),
  uploadProductImages,
  // Middleware to handle product image upload
  // Ensure that only admins can create products // Handle multiple review images upload
  ProductsController.createProductController // Controller method to process the data
);

// Error handling middleware for uploads
// Remove this line from the router and add handleUploadError to your main app error handler, e.g.:
// app.use(handleUploadError);

router.get("/", ProductsController.getAllProduct);
router.get("/:id", ProductsController.getSingleProduct);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  uploadProductImages, // Ensure this middleware handles multiple files correctly
  ProductsController.updateProduct
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  ProductsController.deleteProduct
);

export const ProductsRoutes = router;
