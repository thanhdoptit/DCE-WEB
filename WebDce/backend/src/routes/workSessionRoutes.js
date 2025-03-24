import express from 'express';
import { startWorkSession } from '../controllers/workSessionController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', authenticate, startWorkSession);

export default router;
