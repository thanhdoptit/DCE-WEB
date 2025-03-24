// src/models/WorkShift.js
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
    status: {
      type: DataTypes.ENUM('doing', 'handover', 'done'),
      allowNull: false,
      defaultValue: 'doing'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
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
  };

  return WorkShift;
};