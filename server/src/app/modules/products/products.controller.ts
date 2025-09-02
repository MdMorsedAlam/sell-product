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

// Controller to create product

export const createProductController = catchAsync(
  async (req: Request, res: Response) => {
    // Get the data from req.body (it should now contain form data)
    let form = req.body;
    console.log("Data received in controller:", req.files, req.file, form);
    // If product image exists, add the URL to the product data
    // if (req.file) {
    //   form.imageUrl = getFileUrl(req.file.filename);
    // }

    // If review images exist, add the URLs to the product data
    // if (req.files) {
    //   form.reviews = (req.files as Express.Multer.File[]).map((file) =>
    //     getFileUrl(file.filename)
    //   );
    // }
    // Handle file uploads
    // if (req.files) {
    //   form.media = (req.files as Express.Multer.File[]).map((file) =>
    //     getFileUrl(file.filename)
    //   );
    // }

    // Pass the product data to the service for database insertion
    // const result = await createProduct(form);

    // Send response back with the created product data
    // return res.status(201).json({
    //   success: true,
    //   message: "Product created successfully",
    //   // data: result,
    // });
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

// Controller to update product details
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let { ...updatedData } = req.body;

  const existingProduct = await ProductsService.getSingleProduct(id);
  if (!existingProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Validate ObjectId fields if necessary
  if (updatedData.category && !Types.ObjectId.isValid(updatedData.category)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid category ID");
  }

  // Handle file uploads for media updates
  if (req.files) {
    // Remove existing media and add new media
    updatedData.media = (req.files as Express.Multer.File[]).map((file) =>
      getFileUrl(file.filename)
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
