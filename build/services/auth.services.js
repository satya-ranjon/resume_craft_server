"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkActiveToken = exports.createActivationToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createActivationToken = (user) => {
    const activationCode = (Math.floor(Math.random() * 10000) + 10000).toString();
    const token = jsonwebtoken_1.default.sign({ user, activationCode }, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
    return { activationCode, token };
};
exports.createActivationToken = createActivationToken;
const checkActiveToken = (activateToken, activateCode) => {
    const newUser = jsonwebtoken_1.default.verify(activateToken, process.env.ACTIVATION_SECRET);
    return {
        isToken: newUser.activationCode === activateCode,
        user: newUser.user,
    };
};
exports.checkActiveToken = checkActiveToken;
