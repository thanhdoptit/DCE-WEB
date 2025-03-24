// src/models/Task.js
export default (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      checkInTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      checkOutTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('doing', 'done'),
        defaultValue: 'doing'
      },
      attachments: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of attachment filenames'
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      workShiftId: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
      tableName: 'Tasks',
      timestamps: true
    });
  
    Task.associate = (models) => {
      Task.belongsTo(models.User, {
        foreignKey: 'createdBy'
      });
      Task.belongsTo(models.WorkShift, {
        foreignKey: 'workShiftId'
      });
    };
  
    return Task;
  };
  