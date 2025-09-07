import { IOrder } from "./orders.interface";
import { Order } from "./orders.model"; // Assuming you have this model defined
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

export const OrdersService = {
  createOrder: async (orderData: IOrder) => {
    const order = await Order.create(orderData);
    return order;
  },

  getSingleOrder: async (id: string) => {
    const order = await Order.findById(id).populate("product"); // Populate product if needed
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }
    return order;
  },

  // Service method to fetch all orders and populate product field
  getAllOrders: async (filters: any, paginationOptions: any) => {
    const orders = await Order.find(filters)
      .skip(paginationOptions.skip)
      .limit(paginationOptions.limit)
      .populate("product"); // Populate the 'product' field

    const count = await Order.countDocuments(filters);

    return {
      data: orders,
      meta: {
        total: count,
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    };
  },
  updateOrderStatus: async (id: string, status: string): Promise<IOrder> => {
    const order = await Order.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    // Update the order's status
    order.status = status;
    await order.save();

    return order;
  },

  updateOrder: async (id: string, updatedData: IOrder) => {
    const updatedOrder = await Order.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }
    return updatedOrder;
  },

  deleteOrder: async (id: string) => {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }
    return deletedOrder;
  },
};
