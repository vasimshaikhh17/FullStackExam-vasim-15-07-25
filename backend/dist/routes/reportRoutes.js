"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/daily-revenue', authMiddleware_1.protect, reportController_1.getDailyRevenue);
router.get('/sales-by-category', authMiddleware_1.protect, reportController_1.getSalesByCategory);
exports.default = router;
