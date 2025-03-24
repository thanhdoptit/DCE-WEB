import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // Nếu là user AD thì không cần password
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('admin', 'Datacenter', 'BE', 'Manager', 'user'),
    allowNull: false
  },
  isADUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

export default User;
