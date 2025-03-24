import db from '../models/index.js';
import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
const { Task, WorkShift, User, UserShift } = db;

// Thêm Task mới
export const createTask = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];
  const files = req.files || [];

  try {
    // 🔍 Lấy thông tin ca hiện tại của user
    const userShift = await UserShift.findOne({
      where: { userId },
      include: [{
        model: WorkShift,
        where: {
          date: today,
          status: {
            [Op.ne]: 'done'  // không lấy ca đã done
          }
        }
      }]
    });

    // Nếu không có ca, tạo task với workShiftId là null
    const workShiftId = userShift?.workShiftId || null;

    // Handle file attachments
    const attachments = files.map(file => file.filename);

    console.log('🔍 Creating task with data:', {
      ...req.body,
      workShiftId,
      createdBy: userId,
      attachments
    });

    const task = await Task.create({
      ...req.body,
      workShiftId,
      createdBy: userId,
      checkInTime: new Date(),
      attachments
    });

    // Fetch task with creator info
    const taskWithCreator = await Task.findByPk(task.id, {
      include: [
        { model: User, attributes: ['id', 'fullname'] },
        { model: WorkShift, attributes: ['id', 'name'] }
      ]
    });

    console.log('✅ Task created:', task.id);
    res.status(201).json(taskWithCreator);
  } catch (err) {
    console.error('❌ createTask error:', err);
    // Delete uploaded files if task creation fails
    if (files.length > 0) {
      files.forEach(file => {
        const filePath = path.join('uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    res.status(500).json({ 
      message: 'Lỗi khi tạo công việc',
      error: err.message 
    });
  }
};

// Lấy chi tiết một task
export const getTaskById = async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log('🔍 Getting task by ID:', id);
    
    const task = await Task.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'fullname'] },
        { model: WorkShift, attributes: ['id', 'name'] }
      ]
    });
    
    if (!task) {
      console.error('❌ Task not found:', id);
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    
    console.log('✅ Task found:', task.id);
    res.json(task);
  } catch (err) {
    console.error('❌ getTaskById error:', err);
    res.status(500).json({ 
      message: 'Lỗi khi lấy thông tin công việc',
      error: err.message 
    });
  }
};

// Lấy danh sách Task theo ca với phân trang
export const getTasksByShift = async (req, res) => {
  const { shiftId } = req.params;
  const { page = 1, limit = 10, status } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Kiểm tra workShift tồn tại
    const workShift = await WorkShift.findByPk(shiftId);
    if (!workShift) {
      console.error('❌ WorkShift not found:', shiftId);
      return res.status(404).json({ message: 'Không tìm thấy ca làm việc' });
    }

    console.log('🔍 Getting tasks for shift:', {
      shiftId,
      page,
      limit,
      status
    });

    const where = { workShiftId: shiftId };
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Task.findAndCountAll({
      where,
      include: [
        { model: User, attributes: ['id', 'fullname'] }
      ],
      order: [['checkInTime', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    console.log('✅ Found tasks:', count);
    res.json({
      tasks: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    console.error('❌ getTasksByShift error:', err);
    res.status(500).json({ 
      message: 'Lỗi khi lấy danh sách công việc',
      error: err.message 
    });
  }
};

// Lấy danh sách Task theo người tạo
export const getTasksByCreator = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, status } = req.query;
  const offset = (page - 1) * limit;

  try {
    const where = { createdBy: userId };
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Task.findAndCountAll({
      where,
      include: [
        { model: User, attributes: ['id', 'fullname'] },
        { model: WorkShift, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      tasks: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    console.error('❌ getTasksByCreator error:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách công việc' });
  }
};

// Cập nhật Task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { fullName, checkInTime, checkOutTime, description, status, workShiftId } = req.body;
  const files = req.files || [];

  try {
    console.log('🔍 Finding task to update:', id);
    
    const task = await Task.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'fullname'] },
        { model: WorkShift, attributes: ['id', 'name'] }
      ]
    });

    if (!task) {
      console.error('❌ Task not found:', id);
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    // Validate status
    if (status && !['doing', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    // Kiểm tra workShift tồn tại nếu có thay đổi
    if (workShiftId && workShiftId !== task.workShiftId) {
      const workShift = await WorkShift.findByPk(workShiftId);
      if (!workShift) {
        console.error('❌ WorkShift not found:', workShiftId);
        return res.status(404).json({ message: 'Không tìm thấy ca làm việc' });
      }

      // Check if shift is done
      if (workShift.status === 'done') {
        return res.status(400).json({ message: 'Không thể cập nhật task cho ca đã kết thúc' });
      }
    }

    // Handle multiple file uploads
    let attachments = task.attachments || [];
    if (files.length > 0) {
      // Delete old files if they exist
      if (task.attachments) {
        task.attachments.forEach(attachment => {
          const oldFilePath = path.join('uploads', attachment);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
            console.log('🗑️ Deleted old file:', oldFilePath);
          }
        });
      }

      // Add new files
      attachments = files.map(file => file.filename);
    }

    console.log('📝 Updating task with data:', {
      fullName,
      checkInTime,
      checkOutTime,
      description,
      status,
      workShiftId,
      attachments
    });

    Object.assign(task, { 
      fullName, 
      checkInTime, 
      checkOutTime: status === 'done' ? new Date() : checkOutTime,
      description, 
      status,
      workShiftId,
      attachments
    });
    await task.save();

    // Refresh task data with associations
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: User, attributes: ['id', 'fullname'] },
        { model: WorkShift, attributes: ['id', 'name'] }
      ]
    });

    console.log('✅ Task updated successfully:', task.id);
    res.json(updatedTask);
  } catch (err) {
    console.error('❌ updateTask error:', err);
    // Delete uploaded files if update fails
    if (files.length > 0) {
      files.forEach(file => {
        const filePath = path.join('uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    res.status(500).json({ 
      message: 'Lỗi khi cập nhật công việc',
      error: err.message 
    });
  }
};

// Xoá Task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('🔍 Finding task to delete:', id);
    
    const task = await Task.findByPk(id);
    if (!task) {
      console.error('❌ Task not found:', id);
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    // Xóa file đính kèm nếu có
    if (task.attachments) {
      task.attachments.forEach(attachment => {
        const filePath = path.join('uploads', attachment);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log('🗑️ Deleted attachment file:', filePath);
        }
      });
    }

    await task.destroy();
    console.log('✅ Task deleted successfully:', id);
    res.json({ message: 'Đã xoá công việc' });
  } catch (err) {
    console.error('❌ deleteTask error:', err);
    res.status(500).json({ 
      message: 'Lỗi khi xoá công việc',
      error: err.message 
    });
  }
};
