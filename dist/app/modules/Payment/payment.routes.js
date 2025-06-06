"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/init-payment", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), payment_controller_1.PaymentController.initPayment);
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), payment_controller_1.PaymentController.getAllPayment);
router.get("/verify-payment", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), payment_controller_1.PaymentController.getVerifyPayment);
router.post("/ipn", payment_controller_1.PaymentController.validatePayment);
// Add route to remove unpaid payment
router.delete("/remove-unpaid/:paymentId", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), payment_controller_1.PaymentController.removeUnpaidPayment);
exports.PaymentRoutes = router;
