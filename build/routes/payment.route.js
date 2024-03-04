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
const express_1 = __importDefault(require("express"));
const error_1 = require("../middlewares/error");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const payment_controller_1 = require("../controllers/payment.controller");
const auth_1 = require("../middlewares/auth");
const stripe = require("stripe")(process.env.SCRIPE_SECRET_KEY);
const paymentRoute = express_1.default.Router();
paymentRoute.get("/single", auth_1.isAuthenticated, payment_controller_1.singlePayment);
paymentRoute.get("/", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), payment_controller_1.allPayment);
paymentRoute.post("/", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), payment_controller_1.creaetPayment);
paymentRoute.delete("/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), payment_controller_1.deletePayment);
paymentRoute.put("/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), payment_controller_1.editPayment);
paymentRoute.post("/payment-intent", (0, error_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { price } = req.body;
        if (isNaN(price) || price <= 0) {
            return next(new errorHandler_1.default("Invalid price", 400));
        }
        const amount = price * 100;
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ["card"],
        });
        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
})));
exports.default = paymentRoute;
