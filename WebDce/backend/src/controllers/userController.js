import db from '../models/index.js';  // Import db object
const { User, WorkShift, UserShift } = db;

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'fullname', 'gender', 'dob', 'role', 'isADUser']
    });
    res.json(user);
  } catch (err) {
    console.error('GET /me error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateProfile = async (req, res) => {
    const { fullname, gender, dob } = req.body;
  
    try {
      const updateData = {
        fullname,
        gender
      };
  
      // ✅ Chỉ thêm dob nếu hợp lệ
      if (dob && !isNaN(Date.parse(dob))) {
        updateData.dob = dob;
      }
  
      await User.update(updateData, {
        where: { id: req.user.id }
      });
  
      res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
      console.error('PUT /me error:', err);
      res.status(500).json({ message: 'Lỗi server' });
    }
  };

export const updateSelectedShift = async (req, res) => {
  const { id } = req.params;
  const { shiftCode } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    user.selectedShift = shiftCode;
    await user.save();

    return res.json({ message: 'Cập nhật ca thành công', selectedShift: shiftCode });
  } catch (err) {
    console.error('PUT /selected-shift error:', err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateMyShift = async (req, res) => {
  const userId = req.user.id;
  const { shiftCode } = req.body;

  if (!shiftCode) {
    return res.status(400).json({ message: 'Thiếu mã ca trực' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // 🔍 Tìm hoặc tạo WorkShift hôm nay với shiftCode
    let shift = await WorkShift.findOne({ where: { code: shiftCode, date: today } });
    if (!shift) {
      shift = await WorkShift.create({
        code: shiftCode,
        date: today,
        createdBy: userId
      });
    }

    // 🧹 Xóa mọi UserShift của user trong ngày hôm nay
    const shiftsToday = await WorkShift.findAll({
      where: { date: today },
      include: [{
        model: User,
        where: { id: userId }
      }]
    });

    for (const s of shiftsToday) {
      await UserShift.destroy({
        where: { userId, workShiftId: s.id }
      });
    }

    // ✅ Thêm mới UserShift
    await UserShift.create({
      userId,
      workShiftId: shift.id
    });

    return res.json({
      message: 'Đã cập nhật ca trực thành công',
      shift: { code: shift.code, date: shift.date }
    });

  } catch (err) {
    console.error('❌ updateMyShift error:', err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};


export const getUserShift = async (req, res) => {
  const userId = req.params.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const shift = await WorkShift.findOne({
      where: { date: today },
      include: {
        model: User,
        where: { id: userId },
        through: { attributes: [] }
      }
    });

    if (!shift) return res.json({ selectedShift: '' });

    res.json({ selectedShift: shift.code });
  } catch (err) {
    console.error('Error fetching shift:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

  
 