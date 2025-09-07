import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { OrdersService } from "./orders.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import ApiError from "../../../errors/ApiError";
import { Types } from "mongoose";
import { IOrder } from "./orders.interface";

// Controller to create a new order
export const createOrderController = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Get the order data from req.body
    const orderData = req.body;

    // If order includes product or any other references, validate them here
    if (orderData.product && !Types.ObjectId.isValid(orderData.product)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid product ID");
    }

    try {
      // Pass the order data to the service for database insertion
      const result = await OrdersService.createOrder(orderData);
      sendResponse<IOrder>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Order created successfully",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }
);

// Controller to fetch a single order by ID
const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrdersService.getSingleOrder(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order fetched successfully",
    data: result,
  });
});

// Controller to fetch all orders with filters and pagination
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["name", "phone", "status"]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await OrdersService.getAllOrders(filters, paginationOptions);

  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});
// Controller to update an order's status
export const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    // Validating status value
    if (!["Pending", "Cancelled", "Completed"].includes(status)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid status value");
    }

    // Check if the order exists
    const existingOrder = await OrdersService.getSingleOrder(id);
    if (!existingOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }

    // Update the status
    const updatedOrder = await OrdersService.updateOrderStatus(id, status);

    sendResponse<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  }
);
// Controller to update an order's details
const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  const existingOrder = await OrdersService.getSingleOrder(id);
  if (!existingOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  const result = await OrdersService.updateOrder(id, updatedData);

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order updated successfully",
    data: result,
  });
});

// Controller to delete an order
const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingOrder = await OrdersService.getSingleOrder(id);
  if (!existingOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  const result = await OrdersService.deleteOrder(id);

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order deleted successfully",
    data: result,
  });
});

// Export all controller functions
export const OrdersController = {
  createOrderController,
  getSingleOrder,
  getAllOrders,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
};
