// src/models/UserShift.js
export default (sequelize, DataTypes) => {
    const UserShift = sequelize.define('UserShift', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      workShiftId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  
    return UserShift;
  };