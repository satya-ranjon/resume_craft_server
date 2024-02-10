"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.catchAllUndefinedRoutes = exports.catchAsyncError = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const catchAsyncError = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
};
exports.catchAsyncError = catchAsyncError;
// Catch-all route for handling undefined routes.
const catchAllUndefinedRoutes = (req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl} this route`);
    res.status(404).json({ message: error.message });
    next(error);
};
exports.catchAllUndefinedRoutes = catchAllUndefinedRoutes;
//  Global error handler middleware.
const globalErrorHandler = (err, _req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error !";
    // wrong mongoDB id error
    if (err.name === "CasError") {
        err = new errorHandler_1.default(`Resource not found. Invalid: ${err.path} !`, 400);
    }
    // duplicate key error
    if (err.code === 11000) {
        err = new errorHandler_1.default(`Duplicate ${Object.keys(err.keyValue)} entered !`, 400);
    }
    // wrong jwt error
    if (err.name === "jsonWebTokenError") {
        err = new errorHandler_1.default(`JsonWebToken is invalid,try again !`, 400);
    }
    // jwt expired error
    if (err.name === "TokenExpiredError") {
        err = new errorHandler_1.default(`JsonWebToken is expired,try again !`, 400);
    }
    res.status(err.statusCode).json({ success: false, message: err.message });
};
exports.globalErrorHandler = globalErrorHandler;
