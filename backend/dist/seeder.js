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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const products_1 = require("./data/products");
const Product_1 = __importDefault(require("./models/mongo/Product"));
// Load environment variables
dotenv_1.default.config();
// Function to connect directly to MongoDB
const connectMongo = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('MONGO_URI not found in .env file.');
            process.exit(1);
        }
        yield mongoose_1.default.connect(mongoUri);
        console.log('MongoDB connected for seeding...');
    }
    catch (error) {
        console.error(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
});
// Function to import data
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectMongo();
        // To make the script re-runnable, clear existing products first
        yield Product_1.default.deleteMany();
        // Insert the sample products
        yield Product_1.default.insertMany(products_1.products);
        console.log('✅ Data Imported Successfully!');
        process.exit();
    }
    catch (error) {
        console.error(`❌ Error importing data: ${error}`);
        process.exit(1);
    }
});
// Function to destroy data
const destroyData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectMongo();
        yield Product_1.default.deleteMany();
        console.log('✅ Data Destroyed Successfully!');
        process.exit();
    }
    catch (error) {
        console.error(`❌ Error destroying data: ${error}`);
        process.exit(1);
    }
});
// Logic to run the correct function based on command-line arguments
// To run: `ts-node src/seeder.ts` to import
// To run: `ts-node src/seeder.ts -d` to destroy
if (process.argv[2] === '-d') {
    destroyData();
}
else {
    importData();
}
