import db from '../models/index.js';
const { WorkSession } = db;

export const startWorkSession = async (req, res) => {
  const { shiftCode } = req.body;
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  try {
    // 1. Kiểm tra xem người dùng đã có ca trực hôm nay chưa
    const existingSession = await WorkSession.findOne({
      where: {
        userId,
        '$WorkShift.date$': today
      },
      include: { model: db.WorkShift }
    });

    if (existingSession) {
      return res.status(400).json({ message: 'Bạn đã có ca trực hôm nay' });
    }

    // 2. Kiểm tra xem ca trực (WorkShift) đã được tạo cho hôm nay chưa
    let shift = await WorkShift.findOne({
      where: { code: shiftCode, date: today }
    });

    // 3. Nếu ca chưa có thì tạo mới WorkShift
    if (!shift) {
      shift = await WorkShift.create({
        code: shiftCode,
        date: today,
        createdBy: userId
      });
    }

    // 4. Tạo WorkSession cho user với ca mới
    const session = await WorkSession.create({
      userId,
      shiftId: shift.id,
      startTime: new Date(),
      status: 'started'
    });

    res.json({ message: 'Bắt đầu ca trực thành công', session });
  } catch (err) {
    console.error('❌ startWorkSession error:', err);
    res.status(500).json({ message: 'Lỗi server khi bắt đầu ca trực' });
  }
};
