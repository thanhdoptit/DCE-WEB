import db from '../models/index.js';
const { WorkShift, UserShift, User } = db;
import { Op } from 'sequelize';

// Chọn ca làm việc
export const selectShift = async (req, res) => {
    const { shiftCode } = req.body;
    const userId = req.user.id;
  
    try {
      const today = new Date().toISOString().split('T')[0];
  
      // 🔍 Tìm các ca trực hôm nay
      const todayShifts = await WorkShift.findAll({
        where: { date: today },
        attributes: ['id']
      });
      const shiftIds = todayShifts.map(s => s.id);
  
      // 🔍 Kiểm tra user đã được gán ca hôm nay chưa
      const userShiftToday = await UserShift.findOne({
        where: {
          userId,
          workShiftId: shiftIds
        }
      });
  
      if (userShiftToday) {
        return res.status(400).json({ message: 'Bạn đã có ca hôm nay. Hãy dùng chức năng thay đổi ca.' });
      }
  
      // 🔍 Tìm ca tương ứng với mã ca và ngày hôm nay
      let shift = await WorkShift.findOne({
        where: { code: shiftCode, date: today }
      });
  
      if (shift) {
        if (shift.status === 'done') {
          return res.status(400).json({ message: 'Ca này đã kết thúc.' });
        }
  
        // ✅ Ca tồn tại và chưa done → gán user
        await UserShift.create({ userId, workShiftId: shift.id });
      } else {
        // ✅ Ca chưa tồn tại → tạo mới
        shift = await WorkShift.create({
          code: shiftCode,
          date: today,
          status: 'doing',
          createdBy: userId
        });
  
        await UserShift.create({ userId, workShiftId: shift.id });
      }
  
      return res.json({ message: 'Chọn ca thành công', shift });
    } catch (err) {
      console.error('❌ selectShift error:', err);
      return res.status(500).json({ message: 'Lỗi server khi chọn ca' });
    }
  };
  
// Thay đổi ca
export const changeShift = async (req, res) => {
  const { shiftCode } = req.body;
  const userId = req.user.id;

  try {
    const today = new Date().toISOString().split('T')[0];

   // Xoá ca cũ của user hôm nay
const todayShifts = await WorkShift.findAll({
    where: { date: today },
    attributes: ['id']
  });
  const shiftIds = todayShifts.map(s => s.id);
  
  await UserShift.destroy({
    where: {
      userId,
      workShiftId: shiftIds
    }
  });

    // Tìm hoặc tạo ca mới
    let shift = await WorkShift.findOne({
      where: { code: shiftCode, date: today }
    });

    if (!shift) {
      shift = await WorkShift.create({
        code: shiftCode,
        date: today,
        status: 'doing',
        createdBy: userId
      });
    }

    await UserShift.create({ userId, workShiftId: shift.id });

    res.json({ message: 'Đã chuyển sang ca mới', shift });
  } catch (err) {
    console.error('❌ changeShift error:', err);
    res.status(500).json({ message: 'Lỗi server khi thay đổi ca' });
  }
};

// Kết thúc ca làm việc
export const closeShift = async (req, res) => {
    const shiftId = req.params.id;
  
    try {
      const shift = await WorkShift.findByPk(shiftId);
      if (!shift) return res.status(404).json({ message: 'Ca không tồn tại' });
  
      // Cập nhật trạng thái ca
      shift.status = 'done';
      await shift.save();
  
      // Xoá toàn bộ UserShift liên quan đến ca này (giải phóng user)
      await UserShift.destroy({
        where: { workShiftId: shiftId }
      });
  
      res.json({ message: 'Đã kết thúc và giải phóng ca trực thành công', shift });
    } catch (err) {
      console.error('❌ closeShift error:', err);
      res.status(500).json({ message: 'Lỗi server khi đóng ca' });
    }
  };
  

// Lấy trạng thái ca hiện tại của user
export const getCurrentShift = async (req, res) => {
    const userId = req.user.id;  // phải lấy từ token, không phải req.params
    const today = new Date().toISOString().split('T')[0];
  
    try {
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
  
      if (!userShift) {
        return res.status(404).json({ message: 'Chưa có ca làm việc hôm nay' });
      }
  
      res.json({ shift: userShift.WorkShift });
    } catch (err) {
      console.error('❌ getCurrentShift error:', err);
      res.status(500).json({ message: 'Lỗi server khi lấy ca hiện tại' });
    }
  };
  

export const getAllShifts = async (req, res) => {
    try {
      const shifts = await WorkShift.findAll({
        include: [
          {
            model: User,
            through: { attributes: [] },
            attributes: ['id', 'fullname', 'role']
          }
        ],
        order: [['date', 'DESC'], ['code', 'ASC']]
      });
  
      res.json(shifts);
    } catch (err) {
      console.error('❌ getAllShifts error:', err);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách ca' });
    }
  };

  export const getTodayAvailableShifts = async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
  
      const shifts = await WorkShift.findAll({
        where: { date: today },
        include: [
          {
            model: User,
            through: { attributes: [] },
            attributes: ['id']
          }
        ]
      });
  
      // Chỉ lấy các ca chưa có người làm
      const available = shifts.filter(s => s.Users.length === 0);
      res.json(available);
    } catch (err) {
      console.error('❌ getTodayAvailableShifts error:', err);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách ca còn trống hôm nay' });
    }
  };
  