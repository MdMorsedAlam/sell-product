import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OrdersController } from "./orders.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { uploadImages } from "../../../helpers/fileHandlers"; // Add if needed for image upload middleware
import {
  uploadImage,
  uploadReviews,
} from "../../../helpers/imageUploadMiddleware";

const router = express.Router();

// Route to create a new order
router.post(
  "/create", // Assuming customers or regular users can create orders // Middleware to handle any image uploads for the order
  OrdersController.createOrderController // Controller method to process the data
);

// Route to fetch all orders with pagination and filters
router.get("/", OrdersController.getAllOrders);

// Route to fetch a single order by ID
router.get("/:id", OrdersController.getSingleOrder);

// Route to update an existing order
router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN), // Only admin users can update orders
  uploadImages, // Upload images if needed for the order update
  OrdersController.updateOrder
);
router.patch(
  "/:id/status",  // Endpoint for updating status
  auth(ENUM_USER_ROLE.ADMIN),  // Only allow admins to update status
  OrdersController.updateOrderStatus
);
// Route to delete an order
router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN), // Only admin users can delete orders
  OrdersController.deleteOrder
);

export const OrdersRoutes = router;
