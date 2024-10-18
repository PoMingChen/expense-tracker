'use strict';
const {
  Model
} = require('sequelize');
const { canTreatArrayAsAnd } = require('sequelize/lib/utils');
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    static associate(models) {
      Record.belongsTo(models.User)
      Record.belongsTo(models.Category)
    }
  }
  Record.init({
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    amount: DataTypes.DECIMAL,
    userId: { //Add Foregin Key userId
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: { //Add Foregin Key categoryId
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Record',
  });
  return Record;
};