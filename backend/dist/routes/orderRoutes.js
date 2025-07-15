"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.protect, orderController_1.createOrder);
router.get('/my-orders', authMiddleware_1.protect, orderController_1.getMyOrders);
exports.default = router;
