import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { uploadSingle, uploadMultiple } from '../middleware/uploadMiddleware.js';
import { validateTask, taskValidationRules } from '../middleware/validationMiddleware.js';
import db from '../models/index.js';
const { Task } = db;
import {
  createTask,
  getTaskById,
  getTasksByShift,
  getTasksByCreator,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

// Tạo task mới
router.post('/', 
  authenticate, 
  uploadMultiple('attachments', 10), 
  taskValidationRules,
  validateTask,
  createTask
);

// Lấy task theo ID
router.get('/:id', authenticate, getTaskById);

// Lấy tasks theo ca
router.get('/shift/:shiftId', authenticate, getTasksByShift);

// Lấy tasks theo người tạo
router.get('/creator/:userId', authenticate, getTasksByCreator);

// Cập nhật task
router.put('/:id', 
  authenticate, 
  uploadMultiple('attachments', 10),
  taskValidationRules,
  validateTask,
  updateTask
);

// Cập nhật trạng thái task
router.patch('/:id/status',
  authenticate,
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    try {
      const task = await Task.findByPk(id, {
        include: [
          { model: db.User, attributes: ['id', 'fullname'] },
          { model: db.WorkShift, attributes: ['id', 'name'] }
        ]
      });
      
      if (!task) {
        return res.status(404).json({ message: 'Không tìm thấy task' });
      }

      // Validate status
      if (!['doing', 'done'].includes(status)) {
        return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
      }

      // Nếu chuyển sang done, tự động cập nhật checkOutTime
      if (status === 'done') {
        task.checkOutTime = new Date();
      }

      task.status = status;
      await task.save();

      res.json({ 
        message: 'Cập nhật trạng thái thành công',
        task 
      });
    } catch (err) {
      console.error('❌ updateTaskStatus error:', err);
      res.status(500).json({ 
        message: 'Lỗi khi cập nhật trạng thái',
        error: err.message 
      });
    }
  }
);

// Xóa task
router.delete('/:id', authenticate, deleteTask);

export default router;
