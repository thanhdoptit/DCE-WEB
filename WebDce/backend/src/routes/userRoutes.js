import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import {
  getProfile,
  updateProfile,
  
} from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);



// ✅ Chỉ admin mới được đổi ca của người khác

export default router;
