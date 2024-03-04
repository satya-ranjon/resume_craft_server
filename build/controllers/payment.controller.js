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
exports.editPayment = exports.deletePayment = exports.creaetPayment = exports.singlePayment = exports.allPayment = void 0;
const error_1 = require("../middlewares/error");
const payment_model_1 = __importDefault(require("../models/payment.model"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
exports.allPayment = (0, error_1.catchAsyncError)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield payment_model_1.default.find();
        res.status(201).json(payment);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.singlePayment = (0, error_1.catchAsyncError)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield payment_model_1.default.findOne({ active: true }).select("monthly yearly");
        res.status(201).json({ success: true, payment: payment });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.creaetPayment = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentData = req.body;
        const payment = yield payment_model_1.default.create(paymentData);
        res.status(201).json({ success: true, payment });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.deletePayment = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield payment_model_1.default.findByIdAndDelete(id);
        res
            .status(201)
            .json({ success: true, message: "Delete successfully complate" });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.editPayment = (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const paymentData = req.body;
        const updatedPayment = yield payment_model_1.default.findByIdAndUpdate(id, paymentData, { new: true });
        if (updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.active) {
            yield payment_model_1.default.updateMany({ _id: { $ne: updatedPayment._id } }, { active: false });
        }
        res.status(201).json({ success: true, message: "Successfully Update" });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
