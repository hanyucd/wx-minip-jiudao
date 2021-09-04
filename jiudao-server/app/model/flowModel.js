const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../core/db');

class Flow extends Model {}

Flow.init({
  index: { type: DataTypes.INTEGER },
  artId: { type: DataTypes.INTEGER },
  type: { type: DataTypes.INTEGER }
}, {
  sequelize,
  modelName: 'flow'
});

module.exports = Flow;
