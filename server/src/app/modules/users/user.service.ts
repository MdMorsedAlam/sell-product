import mongoose, { SortOrder } from "mongoose";
import { IUser, IUserFilters } from "./user.interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "./user.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { UserSearchableFields } from "./user.constants";

const create = async (userData: IUser): Promise<IUser | null> => {
  const isExist = await User.isUserExist(userData.email);
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
  }
  const user = await User.create(userData);

  // Return user without password
  const createdUser = await User.findById(user._id).select("-password");
  return createdUser;
};

const getUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: UserSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Filters needs $and to fullfill all the conditions
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Dynamic sort needs  fields to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // If there is no condition , put {} to give all data
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // const teachers = await Teacher.find(whereConditions).sort(sortConditions)
  const result = await User.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleUser = async (email: string): Promise<IUser | null> => {
  const result = await User.findOne({ email: email });
  return result;
};
const getSingleUserById = async (id: string): Promise<IUser | null> => {
  const result = await User.findById( id );
  return result;
};
const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).select("-password");

  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id).select("-password");
  return result;
};

export const UserService = {
  create,
  getUsers,
  getSingleUser,
  getSingleUserById,
  updateUser,
  deleteUser,
};
