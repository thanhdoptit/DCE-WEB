import Sequelize from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import WorkShift from './WorkShift.js';
import WorkSession from './WorkSession.js';

const db = {};

// Kết nối Sequelize và mô hình
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Xuất các mô hình đúng cách
db.User = User(sequelize, Sequelize.DataTypes);  // Thêm (sequelize, Sequelize.DataTypes)
db.WorkShift = WorkShift(sequelize, Sequelize.DataTypes);  // Thêm (sequelize, Sequelize.DataTypes)
db.WorkSession = WorkSession(sequelize, Sequelize.DataTypes);  // Thêm (sequelize, Sequelize.DataTypes)

// Định nghĩa quan hệ (associations)
db.User.associate(db);  // Giúp User liên kết với các mô hình khác nếu có
db.WorkShift.associate(db);
db.WorkSession.associate(db);

export default db;
