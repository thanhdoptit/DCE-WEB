import Sequelize from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import WorkShift from './WorkShift.js';
import UserShiftModel from './UserShift.js';

const db = {};

// Kết nối Sequelize và mô hình
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Xuất các mô hình đúng cách
db.User = User(sequelize, Sequelize.DataTypes);  // Thêm (sequelize, Sequelize.DataTypes)
db.WorkShift = WorkShift(sequelize, Sequelize.DataTypes);  // Thêm (sequelize, Sequelize.DataTypes)
db.UserShift = UserShiftModel(sequelize, Sequelize.DataTypes);

// Định nghĩa quan hệ (associations)

db.User.associate(db);
db.WorkShift.associate(db);
db.UserShift.associate?.(db);

export default db;
