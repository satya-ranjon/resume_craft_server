import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "./error";
import { redis } from "../utils/redis";
import ErrorHandler from "../utils/errorHandler";

// authenticated user
export const isAuthenticated = catchAsyncError(
  async (req: Request, _res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource !", 400)
      );
    }
    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid !", 400));
    }
    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found !", 400));
    }
    req.user = JSON.parse(user);
    next();
  }
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Roles: ${req.user?.role} is not allowed to access this resource !`,
          403
        )
      );
    }
    next();
  };
};
