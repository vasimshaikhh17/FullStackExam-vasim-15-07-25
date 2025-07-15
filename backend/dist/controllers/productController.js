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
exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/mongo/Product"));
const mongoose_1 = require("mongoose");
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const searchQuery = req.query.search ? String(req.query.search) : '';
    try {
        const query = searchQuery
            ? { $text: { $search: searchQuery } }
            : {};
        const count = yield Product_1.default.countDocuments(query);
        const products = yield Product_1.default.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const product = yield Product_1.default.findById(req.params.id);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getProductById = getProductById;
