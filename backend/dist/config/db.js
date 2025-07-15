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
exports.connectDB = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbUrl = process.env.DATABASE_URL;
const mongoUri = process.env.MONGO_URI;
if (!dbUrl || !mongoUri) {
    console.error("Database environment variables DATABASE_URL and MONGO_URI must be set.");
    process.exit(1);
}
// 1. Create and export the instance. This is the single source of truth.
exports.sequelize = new sequelize_1.Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: false,
});
// 2. The connect function NO LONGER syncs models. It just connects.
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelize.authenticate();
        console.log('PostgreSQL connected...');
        yield mongoose_1.default.connect(mongoUri);
        console.log('MongoDB connected...');
    }
    catch (error) {
        console.error('Unable to connect to the databases:', error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
