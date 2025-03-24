import { validationResult, body } from 'express-validator';

export const validateTask = [
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const taskValidationRules = [
  body('fullName').notEmpty().withMessage('Tên công việc không được để trống'),
  body('checkInTime').isISO8601().withMessage('Thời gian bắt đầu không hợp lệ'),
  body('checkOutTime').optional().isISO8601().withMessage('Thời gian kết thúc không hợp lệ'),
  body('description').notEmpty().withMessage('Mô tả không được để trống'),
  body('workShiftId').optional().isInt().withMessage('ID ca làm việc không hợp lệ'),
  body('status').optional().isIn(['doing', 'done']).withMessage('Trạng thái không hợp lệ')
]; 