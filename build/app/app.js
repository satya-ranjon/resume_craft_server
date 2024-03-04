"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const error_1 = require("../middlewares/error");
const resume_route_1 = __importDefault(require("../routes/resume.route"));
const user_route_1 = __importDefault(require("../routes/user.route"));
const history_route_1 = __importDefault(require("../routes/history.route"));
const coverLetter_route_1 = __importDefault(require("../routes/coverLetter.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const blog_route_1 = __importDefault(require("../routes/blog.route"));
const pamentHistory_route_1 = __importDefault(require("../routes/pamentHistory.route"));
const payment_route_1 = __importDefault(require("../routes/payment.route"));
(0, dotenv_1.configDotenv)();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use((0, cookie_parser_1.default)());
// router
app.get("/", (_req, res, _next) => {
    res.send("server is run....");
});
app.use("/auth/v1", auth_route_1.default);
app.use("/resume/v1", resume_route_1.default);
app.use("/coverLetter/v1", coverLetter_route_1.default);
app.use("/user/v1", user_route_1.default);
app.use("/history/v1", history_route_1.default);
app.use("/blog/v1", blog_route_1.default);
app.use("/payment/v1/history", pamentHistory_route_1.default);
app.use("/payment/v1", payment_route_1.default);
// handling undefined routes
app.use(error_1.catchAllUndefinedRoutes);
// Global error handler
app.use(error_1.globalErrorHandler);
exports.default = app;
