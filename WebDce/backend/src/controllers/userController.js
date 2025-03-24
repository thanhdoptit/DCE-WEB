import User from '../models/User.js';
import { WorkShift } from '../models/index.js'; 
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
    const { shiftCode } = req.body;
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.selectedShift = shiftCode;
      await user.save();
      return res.json({ message: 'Cập nhật ca thành công', selectedShift: shiftCode });
    } catch (err) {
      console.error('PUT /selected-shift error:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  };
  

  export const getUserShift = async (req, res) => {
    const userId = req.params.id;
  
    try {
      // Lấy thông tin ca làm việc của người dùng từ bảng WorkShift
      const userShift = await WorkShift.findOne({
        where: {
          '$Users.id$': userId,  // Kiểm tra xem người dùng có tham gia vào ca làm việc này không
        },
        include: [{
          model: User,
          attributes: ['id'],
        }],
      });
  
      if (userShift) {
        return res.json({
          selectedShift: userShift.code,  // Trả về mã ca làm việc
          shiftId: userShift.id,  // Trả về ID của ca làm việc
        });
      } else {
        return res.status(404).json({ message: 'Không có ca làm việc cho người dùng' });
      }
    } catch (err) {
      console.error('Error fetching user shift:', err);
      return res.status(500).json({ message: 'Lỗi server khi lấy thông tin ca làm việc' });
    }
  };
  
 