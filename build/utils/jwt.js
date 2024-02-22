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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOption = exports.accessTokenOption = void 0;
const redis_1 = require("./redis");
// parse environment variables to integrates with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);
// options for cookies
exports.accessTokenOption = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    secure: true,
    httpOnly: true,
    sameSite: "lax",
};
exports.refreshTokenOption = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    secure: true,
    httpOnly: true,
    sameSite: "lax",
};
const sendToken = (user, statusCode, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();
    //Upload session to redis
    yield redis_1.redis.set(user._id, JSON.stringify(user));
    // only set secure to true in production
    if (process.env.NODE_DEV === "production") {
        exports.accessTokenOption.secure = true;
    }
    res.cookie("access_token", accessToken, exports.accessTokenOption);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOption);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
});
exports.sendToken = sendToken;
