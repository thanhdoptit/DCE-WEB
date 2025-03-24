// shiftRoutes.js
import express from 'express';
import {
  selectShift,
  changeShift,
  closeShift,
  getAllShifts,
  getTodayAvailableShifts,
  getCurrentShift
} from '../controllers/shiftController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user', (req, res, next) => {
  console.log('🔍 Request received at /api/shifts/user');
  console.log('Headers:', req.headers);
  next();
}, authenticate, getCurrentShift);
router.put('/select', authenticate, selectShift);
router.put('/change', authenticate, changeShift);
router.put('/close/:id', authenticate, closeShift);
router.get('/all', authenticate, getAllShifts);
router.get('/today-available', authenticate, getTodayAvailableShifts);

export default router;