'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Record)
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // email cannot be null
      unique: true, // email must be unique
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // password cannot be null
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};