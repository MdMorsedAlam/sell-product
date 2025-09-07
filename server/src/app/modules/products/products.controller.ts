import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { createProduct, ProductsService } from "./products.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import ApiError from "../../../errors/ApiError";
import { Types } from "mongoose";
import { IProducts } from "./products.interface";
import {
  getFileUrl,
  uploadImage,
  uploadReviews,
} from "../../../helpers/imageUploadMiddleware";
import { newsFilterableFields } from "./products.contants";

// Make sure catchAsync is correctly handling async errors
export const createProductController = catchAsync(
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    // Get the data from req.body (it should now contain form data)
    let form = req.body;
    // If product image exists, add the URL to the product data
    // Check if imageUrl exists and append it to the form
    if (req.files && req.files["imageUrl"]) {
      // Access the first file in the imageUrl array
      form.imageUrl = getFileUrl(req.files["imageUrl"][0].filename);
    }
    // Check if review images exist and append them to the form
    if (req.files && req.files["reviews"]) {
      // Map through the reviews and get the file URLs
      form.reviews = (req.files["reviews"] as Express.Multer.File[]).map(
        (file) => getFileUrl(file.filename)
      );
    }
    // Pass the product data to the service for database insertion
    try {
      const result = await createProduct(form);
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message, // This will include the "Product with the same name already exists."
      });
    }
  }
);

// Controller to fetch a single product
const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductsService.getSingleProduct(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  sendResponse<IProducts>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product fetched successfully",
    data: result,
  });
});

// Controller to fetch all products with filters and pagination
const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, newsFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ProductsService.getAllProduct(
    filters,
    paginationOptions
  );

  sendResponse<IProducts[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateProduct = catchAsync(async (req: any, res: Response) => {
  const { id } = req.params;
  let { ...updatedData } = req.body;

  const existingProduct = await ProductsService.getSingleProduct(id);
  if (!existingProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Only update fields that are provided
  if (req.files && req.files["imageUrl"]) {
    updatedData.imageUrl = getFileUrl(req.files["imageUrl"][0].filename);
  }

  if (req.files && req.files["reviews"]) {
    updatedData.reviews = (req.files["reviews"] as Express.Multer.File[]).map(
      (file) => getFileUrl(file.filename)
    );
  }

  const result = await ProductsService.updateProduct(id, updatedData);

  sendResponse<IProducts>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

// Controller to delete a product
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingProduct = await ProductsService.getSingleProduct(id);
  if (!existingProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  const result = await ProductsService.deleteProduct(id);

  sendResponse<IProducts>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});

// Export all controller functions
export const ProductsController = {
  createProductController,
  getSingleProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};
