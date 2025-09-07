import { Schema } from "mongoose";
import { Document, Types, Model } from "mongoose";

// Interface for Order document
export interface IOrder extends Document {
  name: string;
  address: string;
  phone: string;
  status:string;
  product: Schema.Types.ObjectId; // reference to Product
  totalPrice: string;
  orderDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Order model (optional custom methods)
export interface IOrderModel extends Model<IOrder> {
  // You can add custom static methods here
  // e.g. findByEmail(email: string): Promise<IOrder[]>
}
