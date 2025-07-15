import { Router } from 'express';
import { getCartDetails } from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/details', protect, getCartDetails);

export default router;