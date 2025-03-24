import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Kiểm tra token có trong header không
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Thiếu token' });
  }

  const token = authHeader.split(' ')[1]; // Tách Bearer và token

  try {
    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kiểm tra nếu token hợp lệ, lấy user từ database
    const user = await User.findByPk(decoded.id);
    
    // Nếu không tìm thấy user trong database, trả về lỗi 403
    if (!user) {
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }

    req.user = user; // Gán thông tin user vào req để sử dụng ở các middleware tiếp theo
    next(); // Tiếp tục xử lý request
  } catch (err) {
    // Nếu có lỗi trong quá trình xác thực token (hết hạn hoặc không hợp lệ)
    return res.status(403).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
};
