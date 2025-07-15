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
exports.getMyOrders = exports.createOrder = void 0;
const db_1 = require("../config/db");
const models_1 = require("../models");
const models_2 = require("../models");
const Product_1 = __importDefault(require("../models/mongo/Product"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { cartItems } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'No items in cart' });
    }
    const transaction = yield db_1.sequelize.transaction();
    try {
        const productIds = cartItems.map((item) => item.productId);
        const products = yield Product_1.default.find({ '_id': { $in: productIds } });
        let totalAmount = 0;
        for (const item of cartItems) {
            const product = products.find(p => p._id.toString() === item.productId);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Not enough stock for ${product.name}`);
            }
            totalAmount += product.price * item.quantity;
        }
        const order = yield models_1.Order.create({
            userId,
            totalAmount,
        }, { transaction });
        for (const item of cartItems) {
            const product = products.find(p => p._id.toString() === item.productId);
            yield models_2.OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                productName: product.name,
                quantity: item.quantity,
                price: product.price,
            }, { transaction });
            product.stock -= item.quantity;
            yield product.save();
        }
        yield transaction.commit();
        res.status(201).json(order);
    }
    catch (error) {
        yield transaction.rollback();
        res.status(500).json({ message: error.message || 'Server error during order creation' });
    }
});
exports.createOrder = createOrder;
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    try {
        const orders = yield models_1.Order.findAll({
            where: { userId },
            include: [models_2.OrderItem],
            order: [['createdAt', 'DESC']],
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getMyOrders = getMyOrders;
