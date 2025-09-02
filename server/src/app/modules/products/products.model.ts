import { Schema, model, Types } from "mongoose";
import { IProducts, IProductsModel } from "./products.interface";

const ProductsSchema = new Schema<IProducts, IProductsModel>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    subTitle: { type: String, default: "" },
    description: { type: String, required: true },
    buttonText: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    gift: { type: String, default: "" },
    price: { type: Number, required: true },
    offerPrice: { type: Number, default: 0 },
    problem: { type: String, default: "" },
    problemSolving: { type: String, default: "" },
    solutions: { type: [String], default: [] },
    eatProduct: { type: String, default: "" },
    useProduct: { type: String, default: "" },
    reviews: { type: [String], default: [] },
    contactNumber: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Index for title and category (you can add more fields if needed)
ProductsSchema.index({ title: 1, gift: 1 }, { unique: true });

export const Product = model<IProducts, IProductsModel>(
  "Product",
  ProductsSchema
);
