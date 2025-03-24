import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import UserModel from './User.js';
import WorkShiftModel from './WorkShift.js';
import WorkSessionModel from './WorkSession.js';

const db = {};

// Khởi tạo Sequelize instance
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Định nghĩa mô hình mà không dùng 'new'
db.User = UserModel(db.sequelize, DataTypes);        // Gọi hàm trả về mô hình
db.WorkShift = WorkShiftModel(db.sequelize, DataTypes);  // Gọi hàm trả về mô hình
db.WorkSession = WorkSessionModel(db.sequelize, DataTypes); // Gọi hàm trả về mô hình

// Định nghĩa quan hệ (associations)
db.User.associate(db);  // Giúp User liên kết với các mô hình khác nếu có
db.WorkShift.associate(db);
db.WorkSession.associate(db);

export default db;
