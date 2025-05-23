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
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../helper/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const UserBlockIntoDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyuser = yield prisma_1.default.user.findFirst({
        where: { id: user.id, status: client_1.UserStatus.ACTIVE },
    });
    if (!verifyuser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User Not Found");
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const verifydata = yield transactionClient.user.findFirst({
            where: { id: user.id },
        });
        if ((verifydata === null || verifydata === void 0 ? void 0 : verifydata.status) === "BLOCKED") {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already blocked");
        }
        yield transactionClient.user.update({
            where: { id: user.id },
            data: {
                status: client_1.UserStatus.BLOCKED,
            },
        });
    }));
    return result;
});
const getAdminDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUser = yield prisma_1.default.user.count();
    const totalMovies = yield prisma_1.default.content.count();
    const totalPayment = yield prisma_1.default.payment.count();
    const totalEaring = yield prisma_1.default.payment.aggregate({ _sum: { amount: true } });
    return {
        totalUser,
        totalMovies,
        totalPayment,
        totalEaring
    };
});
exports.AdminService = {
    UserBlockIntoDB,
    getAdminDashboardStats,
};
