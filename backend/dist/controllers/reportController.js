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
exports.getSalesByCategory = exports.getDailyRevenue = void 0;
const db_1 = require("../config/db");
const sequelize_1 = require("sequelize");
const models_1 = require("../models"); // Correct way to import the SQL model
const Product_1 = __importDefault(require("../models/mongo/Product")); // Correct way to import the Mongoose model
// This function is likely correct, no changes needed here.
const getDailyRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const revenue = yield db_1.sequelize.query(`SELECT DATE(o."createdAt") as date, SUM(o."totalAmount") as revenue
       FROM orders o
       WHERE o."createdAt" >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(o."createdAt")
       ORDER BY date ASC;`, { type: sequelize_1.QueryTypes.SELECT });
        res.json(revenue);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching daily revenue.' });
    }
});
exports.getDailyRevenue = getDailyRevenue;
const getSalesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Fetch all order items from the SQL database.
        const allOrderItems = yield models_1.OrderItem.findAll();
        if (allOrderItems.length === 0) {
            return res.json([]); // Return an empty array if there are no orders
        }
        // Step 2: Get all unique product IDs from the order items.
        const productIds = allOrderItems.map(item => item.productId);
        // Step 3: Fetch the corresponding products from MongoDB to get their categories.
        // We only need the _id and category fields for efficiency.
        const productsFromMongo = yield Product_1.default.find({ _id: { $in: productIds } }).select('_id category');
        // Step 4: Create a simple map for fast lookups (ID -> Category).
        const productCategoryMap = new Map(productsFromMongo.map(p => [p._id.toString(), p.category]));
        // Step 5: Calculate the total sales for each category.
        const categorySales = {};
        for (const item of allOrderItems) {
            const category = productCategoryMap.get(item.productId);
            if (category) {
                // Initialize the category if it's the first time we've seen it
                if (!categorySales[category]) {
                    categorySales[category] = 0;
                }
                // CRITICAL FIX: Sequelize returns DECIMAL as a string. We must parse it to a number.
                const itemTotal = item.price * item.quantity;
                categorySales[category] += itemTotal;
            }
        }
        // Step 6: Format the result into the array structure required by the exam.
        const result = Object.entries(categorySales).map(([category, totalSales]) => ({
            _id: category,
            totalSales: totalSales,
        }));
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching sales by category.' });
    }
});
exports.getSalesByCategory = getSalesByCategory;
