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
exports.getAllPamentHistory = exports.createPamentHistory = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const error_1 = require("../middlewares/error");
const pamentHistory_model_1 = __importDefault(require("../models/pamentHistory.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const redis_1 = require("../utils/redis");
//* if user downloadlimite timeLimite over then set just new downloadlimite or timeLimite not over then current downloadlimite + new downloadlimite
exports.createPamentHistory = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { type, downloadlimite, timeLimite, amount, transactionId, price } = req.body;
        if (!type ||
            !downloadlimite ||
            !timeLimite ||
            !amount ||
            !transactionId ||
            !price) {
            return next(new errorHandler_1.default("Invalid Data", 400));
        }
        const pamentHistory = new pamentHistory_model_1.default({
            user: req.user,
            type,
            downloadlimite,
            timeLimite,
            amount,
            transactionId,
            price,
        });
        const history = yield pamentHistory.save();
        if (req.user) {
            const timeLimiteDifference = Date.now() - req.user.plan.checkoutDate;
            const IsdaysDifferenceTrue = Math.floor(timeLimiteDifference / (1000 * 60 * 60 * 24)) >
                req.user.plan.timeLimite;
            const updateUser = yield user_model_1.default.findOneAndUpdate({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, Object.assign(Object.assign({}, req.user), { plan: {
                    type: type,
                    downloadlimite: IsdaysDifferenceTrue
                        ? downloadlimite
                        : req.user.plan.downloadlimite + downloadlimite,
                    timeLimite: timeLimite,
                    checkoutDate: Date.now(),
                } }), { new: true, upsert: true });
            yield redis_1.redis.set((_b = req.user) === null || _b === void 0 ? void 0 : _b._id, JSON.stringify(updateUser));
            res.status(201).json({
                success: true,
                pamentHistory: history,
                user: updateUser,
            });
        }
        return next(new errorHandler_1.default("Invalid Data", 400));
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.getAllPamentHistory = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const history = yield pamentHistory_model_1.default.find({
            user: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
        }).sort({ createdAt: -1 });
        res.status(201).json({ success: true, history: history });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
