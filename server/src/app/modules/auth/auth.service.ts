import bcrypt from "bcrypt";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { User } from "../users/user.model";
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "./auth.interface";
import { jwtHelpers } from "../../../helpers/jwtHelper";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { sendEmail } from "./sendEmail";

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  // If user does not exist or password is incorrect
  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }
  // Check if user exists and password is correct
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "password mismatch");
  }

  // If user exists and password is correct, return the user object with the token and refresh token

  const { email: userEmail, role, needsPasswordChange } = isUserExist;
  // TODO: generate token and refresh token here
  const accessToken = jwtHelpers.createToken(
    { userEmail, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  // refresh token
  const refreshToken = jwtHelpers.createToken(
    { userEmail, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
  }

  // checking deleted user's refresh token
  const { userEmail } = verifiedToken;
  const isUserExist = await User.isUserExist(userEmail);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  // generate new token and refresh token

  const newAccessToken = jwtHelpers.createToken(
    {
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  // return new tokens
  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  // // checking is user exist
  // const isUserExist = await User.isUserExist({id: user?.userId});

  //alternative way
  const isUserExist = await User.findOne({ email: user?.userEmail }).select(
    "+password"
  );

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  // check old password matching
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old Password is incorrect");
  }

  isUserExist.password = newPassword;
  isUserExist.needsPasswordChange = true;
  // updating using save()
  isUserExist.save();
};

const forgotPassword = async (payload: { email: string }) => {
  // Find user by id with email and name fields
  const user = await User.findOne(
    { email: payload.email },
    {
      role: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
    }
  ).lean();

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found!");
  }

  if (!user.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User email is not found!");
  }

  // Generate password reset token (expires in 50 minutes)
  const passResetToken = await jwtHelpers.resetToken(
    { email: user.email },
    config.jwt.secret as string,
    "50m"
  );

  // Create reset link
  const resetLink: string = `${config.resetlink}?token=${passResetToken}`;

  // Send email
  await sendEmail(
    user.email,
    `
    <div>
      <p>Hi, ${user.firstName} ${user.lastName}</p>
      <p>Your password reset link: <a href="${resetLink}">Click Here</a></p>
      <p>This link will expire in 50 minutes.</p>
      <p>Thank you</p>
    </div>
    `
  );

  return {
    message: "Password reset link sent to your email",
    resetToken: passResetToken, // Optional: return token for testing
  };
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string
) => {
  const { email, newPassword } = payload;

  const user = await User.findOne({ email: email }, { email: 1 });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found!");
  }
  const isVarified = await jwtHelpers.verifyToken(
    token,
    config.jwt.secret as string
  );

  const password = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds)
  );

  await User.updateOne({ email: email }, { password });
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
