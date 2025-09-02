import { Model, Types } from "mongoose";

// Product interface with types for each field based on the schema
export interface IProducts {
  name: string;
  title: string;
  subTitle: string;
  description: string;
  buttonText: string;
  imageUrl?: string;
  gift?: string;
  price: number;
  offerPrice: number;
  problem?: string;
  problemSolving?: string;
  solutions?: string[];
  eatProduct: string;
  useProduct: string;
  reviews?: string[];
  contactNumber?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Product model type (for Mongoose) with custom methods
export interface IProductsModel extends Model<IProducts> {
  findByCategory(category: string): Promise<IProducts[]>;
}
