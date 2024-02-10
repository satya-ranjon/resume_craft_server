"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("./error");
const redis_1 = require("../utils/redis");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
// authenticated user
exports.isAuthenticated = (0, error_1.catchAsyncError)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new errorHandler_1.default("Please login to access this resource !", 400));
    }
    const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
        return next(new errorHandler_1.default("Access token is not valid !", 400));
    }
    const user = yield redis_1.redis.get(decoded.id);
    if (!user) {
        return next(new errorHandler_1.default("User not found !", 400));
    }
    req.user = JSON.parse(user);
    next();
}));
// validate user role
const authorizeRoles = (...roles) => {
    return (req, _res, next) => {
        var _a, _b;
        if (!roles.includes(((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || "")) {
            return next(new errorHandler_1.default(`Roles: ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} is not allowed to access this resource !`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
