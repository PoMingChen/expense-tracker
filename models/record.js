'use strict';
const {
  Model
} = require('sequelize');
const { canTreatArrayAsAnd } = require('sequelize/lib/utils');
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Record.belongsTo(models.User)
      Record.belongsTo(models.Category)
    }
  }
  Record.init({
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    amount: DataTypes.DECIMAL,
    category: DataTypes.STRING,
    userId: { //Add Foregin Key userId
      type: DataTypes.INTEGER,
      allowNull: false
    }
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