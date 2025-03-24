import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import {
  getProfile,
  updateProfile,
  updateMyShift,
  getUserShift,
  
} from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);
router.get('/:id/shift',  getUserShift);
router.put('/selected-shift', authenticate, updateMyShift);

// ✅ Chỉ admin mới được đổi ca của người khác

export default router;
