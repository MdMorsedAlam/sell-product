import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder, Types } from "mongoose";
import { newsSearchableFields } from "./products.contants";
import { Product } from "./products.model";
import { IProducts } from "./products.interface";

// Service to create a product
export const createProduct = async (data: IProducts): Promise<IProducts> => {
  try {
    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ name: data.name });

    if (existingProduct) {
      throw new Error("Product with the same name already exists.");
    }

    // Create and save the new product
    const product = new Product(data);
    await product.save();
    return product;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error creating product: " + error.message);
    } else {
      throw new Error("Error creating product: " + String(error));
    }
  }
};

const getSingleProduct = async (id: string): Promise<IProducts | null> => {
  const result = await Product.findById(id);
  return result;
};

const getAllProduct = async (
  filters: Record<string, any>, // Use appropriate filters, e.g., status, type, etc.
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IProducts[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: newsSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Filters implementation

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Product.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateProduct = async (
  id: string,
  payload: Partial<IProducts>
): Promise<IProducts | null> => {
  // Only update fields that exist in the payload
  const result = await Product.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteProduct = async (id: string): Promise<IProducts | null> => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

export const ProductsService = {
  createProduct,
  getSingleProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};
