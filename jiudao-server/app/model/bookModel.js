const { Model, DataTypes, Op } = require('sequelize');
const axios = require('axios');
const util = require('util');
const sequelize = require('../../core/db');
const Favor = require('./favorModel');

class Book extends Model {
  async detail(id) {
    const url = util.format(global.config.yushu.detailUrl, id);
    const result = await axios.get(url);
    return result.data;
  }

  static async searchFromYuShu(q, start, count, summary = 1) {
    const url = util.format(global.config.yushu.keywordUrl, encodeURI(q), count, start, summary);
    const result = await axios.get(url);
    return result.data;
  }

  static async getMyFavorBookCount(uid) {
    //Fovor.count是sequelize在数据上挂载的只求数量的方法,返回的是一个数字
    const count = await Favor.count({
      where: {
        type: 400, uid
      }
    });
    return count;
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
