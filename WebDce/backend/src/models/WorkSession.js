export default (sequelize, DataTypes) => {
    const WorkSession = sequelize.define('WorkSession', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shiftId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'started',
      },
    });
  
    WorkSession.associate = (models) => {
      WorkSession.belongsTo(models.User, { foreignKey: 'userId' });
      WorkSession.belongsTo(models.WorkShift, { foreignKey: 'shiftId' });
    };
  
    return WorkSession;
  };
  