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
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    monthly: {
        free: {
            price: { type: Number, required: true },
            download: { type: Number, required: true },
        },
        premium: {
            price: { type: Number, required: true },
            download: { type: Number, required: true },
        },
        enterprise: {
            price: { type: Number, required: true },
            download: { type: Number, required: true },
        },
        discount: {
            amount: { type: Number, required: false },
        },
    },
    yearly: {
        free: {
            price: { type: Number, required: true },
            download: { type: Number, required: true },
        },
        premium: {
            price: { type: Number, required: true },
            download: { type: Number, required: true },
        },
        enterprise: {
            price: { type: Number, required: true },
            download: { type: Number, required: true },
        },
        discount: {
            amount: { type: Number, required: false },
        },
    },
    active: { type: Boolean, required: true, default: false },
}, { timestamps: true, versionKey: false });
paymentSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew && this.active) {
            //* If a new Payment is being created and it's active then
            //* Deactivate all other existing payments
            yield this.model("Payment").updateMany({ _id: { $ne: this._id } }, { $set: { active: false } });
        }
        next();
    });
});
const PaymentModel = (0, mongoose_1.model)("Payment", paymentSchema);
exports.default = PaymentModel;
