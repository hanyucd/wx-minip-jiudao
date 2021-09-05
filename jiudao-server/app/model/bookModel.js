const { Model, DataTypes, Op } = require('sequelize');
const axios = require('axios');
const util = require('util');
const sequelize = require('../../core/db');

class Book extends Model {
  async detail(id) {
    const url = util.format(global.config.yushu.detailUrl, id);
    const result = await axios.get(url);
    return result.data;
  }
}

Book.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  favNums: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  sequelize: sequelize,
  modelName: 'book',
});

module.exports = Book;
