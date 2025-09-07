import { Schema, model, Types } from "mongoose";
import { IOrder, IOrderModel } from "./orders.interface";

const OrderSchema = new Schema<IOrder, IOrderModel>(
  {
    name: { type: String, required: true, default: "" },
    address: { type: String, required: true, default: "" },
    phone: { type: String, required: true, default: "" },
    status: { type: String, required: true, default: "Pending" },
    product: { type: Types.ObjectId, ref: "Product", required: true },
    totalPrice: { type: String, default: "" },
    orderDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

export const Order = model<IOrder, IOrderModel>("Order", OrderSchema);
