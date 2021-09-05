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

    books.forEach(book => {
      HotBook._getEachBookStatus(book, favors);
    });

    return { books, ids, favors };
  }

  static _getEachBookStatus(book, favors) {
    let count = 0;
    favors.forEach(favor => {
      if (book.id === favor.artId) {
        count = favor.get('count');
      }
    });
    book.setDataValue('favNums', count);
    return book;
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
