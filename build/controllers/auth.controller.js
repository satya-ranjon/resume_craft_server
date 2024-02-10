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
exports.updateAccessToken = exports.userLogout = exports.userLogin = exports.userActivation = exports.userRegister = void 0;
const error_1 = require("../middlewares/error");
const auth_services_1 = require("../services/auth.services");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const jwt_1 = require("../utils/jwt");
const redis_1 = require("../utils/redis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.userRegister = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const isEmailExist = yield user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new errorHandler_1.default("Email already exist !", 400));
        }
        const user = {
            name,
            email,
            password,
        };
        const activationToken = (0, auth_services_1.createActivationToken)(user);
        const activationCode = activationToken.activationCode;
        const data = { name, activationCode };
        // Send Activation mail
        try {
            yield (0, sendMail_1.default)({
                email,
                subject: "Activate your account",
                template: "activation-mail.ejs",
                data,
            });
            res.status(201).json({
                success: true,
                message: `Please check your email: ${email} to active your account.`,
                activationToken: activationToken.token,
            });
        }
        catch (error) {
            return next(new errorHandler_1.default(error.message, 400));
        }
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.userActivation = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { activateToken, activateCode } = req.body;
        const { isToken, user } = (0, auth_services_1.checkActiveToken)(activateToken, activateCode);
        if (!isToken) {
            return next(new errorHandler_1.default("Invalid activation code !", 400));
        }
        const { name, email, password } = user;
        const existUser = yield user_model_1.default.findOne({ email });
        console.log(existUser);
        if (existUser) {
            return next(new errorHandler_1.default("Email already exist !", 400));
        }
        const newUser = yield user_model_1.default.create({
            name,
            email,
            password,
        });
        res.status(201).json({
            success: true,
            user: { name: newUser.name, email: newUser.email },
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.userLogin = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorHandler_1.default("Please enter your email and password !", 400));
        }
        const user = yield user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new errorHandler_1.default("Invalid email or password !", 400));
        }
        const isPasswordMatch = yield user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new errorHandler_1.default("Invalid email or password", 400));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
// logout user
exports.userLogout = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        yield redis_1.redis.del((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        res.status(200).json({
            success: true,
            message: "Logout successfully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
// update access token
exports.updateAccessToken = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refresh_token = req.cookies.refresh_token;
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded) {
            return next(new errorHandler_1.default("Could not find refresh token", 400));
        }
        const session = yield redis_1.redis.get(decoded.id);
        if (!session) {
            return next(new errorHandler_1.default("Could not find refresh token", 400));
        }
        const user = JSON.parse(session);
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET || "", {
            expiresIn: "5m",
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET || "", {
            expiresIn: "3d",
        });
        res.cookie("access_token", accessToken, jwt_1.accessTokenOption);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOption);
        res.status(200).json({
            success: true,
            user,
            accessToken,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
