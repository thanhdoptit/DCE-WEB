export default (sequelize, DataTypes) => {
    const WorkShift = sequelize.define('WorkShift', {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    });
  
    // Định nghĩa quan hệ nếu cần thiết
    WorkShift.associate = (models) => {
      // Ví dụ: WorkShift có thể có nhiều WorkSessions
      WorkShift.hasMany(models.WorkSession, { foreignKey: 'shiftId' });
    };
  
    return WorkShift;
  };
  