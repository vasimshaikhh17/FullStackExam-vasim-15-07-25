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
exports.getCartDetails = void 0;
const Product_1 = __importDefault(require("../models/mongo/Product"));
const mongoose_1 = require("mongoose");
const getCartDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productIds } = req.body;
    if (!Array.isArray(productIds) || productIds.some(id => !(0, mongoose_1.isValidObjectId)(id))) {
        return res.status(400).json({ message: 'Invalid product IDs provided.' });
    }
    try {
        const products = yield Product_1.default.find({
            '_id': { $in: productIds }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getCartDetails = getCartDetails;
