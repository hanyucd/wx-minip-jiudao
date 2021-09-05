const { Sequelize, Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../../core/db');
const Favor = require('./favorModel');

class HotBook extends Model {
  static async getAll() {
    const books = await HotBook.findAll({
      order: [
        ['index', 'ASC']
      ]
    });

    const ids = [];
    books.forEach(item => {
      ids.push(item.id);
    });
    
    const favors = await Favor.findAll({
      where: {
        artId: {
          [Op.in]: ids
        }
      },
      group: 'artId', // group对art_id进行分组，但如果对多个数组分组的话是一个笛卡尔积
      attributes: [ 'artId', [Sequelize.fn('COUNT', '*'), 'count'] ]
    });
    
    return { ids, favors };
  }
}

HotBook.init({
  index: { type: DataTypes.INTEGER },
  image: { type: DataTypes.STRING },
  author: { type: DataTypes.STRING },
  title: { type: DataTypes.STRING },
}, {
  sequelize,
  modelName: 'hot_book'
});

module.exports = HotBook;
