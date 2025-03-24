import db from '../models/index.js';  // Import db object
const { User, WorkShift, UserShift } = db;
const { Op } = db.Sequelize;

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


 