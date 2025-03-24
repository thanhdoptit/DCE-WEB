import jwt from 'jsonwebtoken';
import db from '../models/index.js';
const { User } = db;

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Thiếu token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(403).json({ message: 'Token không hợp lệ' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
};
