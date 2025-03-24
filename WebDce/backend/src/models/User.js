// src/models/User.js
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
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

  User.associate = (models) => {
    User.belongsToMany(models.WorkShift, {
      through: models.UserShift,
      foreignKey: 'userId',
      otherKey: 'workShiftId'
    });
  };

  return User;
};
