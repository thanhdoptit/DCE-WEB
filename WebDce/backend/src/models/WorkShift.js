// src/models/WorkShift.js
export default (sequelize, DataTypes) => {
  const WorkShift = sequelize.define('WorkShift', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('doing', 'handover', 'done'),
      allowNull: false,
      defaultValue: 'doing'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    workedUsers: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Mảng chứa thông tin người đã làm việc trong ca: [{id, username, fullname}]'
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['code', 'date']
      }
    ]
  });

  WorkShift.associate = (models) => {
    WorkShift.belongsToMany(models.User, {
      through: models.UserShift,
      foreignKey: 'workShiftId',
      otherKey: 'userId'
    });
    WorkShift.hasMany(models.UserShift, {
      foreignKey: 'workShiftId'
    });
  };

  return WorkShift;
};