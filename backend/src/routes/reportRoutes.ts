import { Router } from 'express';
import { getDailyRevenue, getSalesByCategory } from '../controllers/reportController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/daily-revenue', protect, getDailyRevenue);
router.get('/sales-by-category', protect, getSalesByCategory);

export default router;