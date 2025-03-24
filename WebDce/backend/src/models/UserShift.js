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
  
    UserShift.associate = (models) => {
      UserShift.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      UserShift.belongsTo(models.WorkShift, {
        foreignKey: 'workShiftId'
      });
    };
  
    return UserShift;
  };