const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../../core/db');
const Art = require('../service/artService');

class Favor extends Model {
  /**
   * 点赞
   */
  static async like(art_id, type, uid) {
    const favor = await this.findOne({
      where: { art_id, type, uid }
    });

    console.log('favor:', favor);
    
    if (favor) {
      throw new global.errors.LikeError();
    }

    // 这里用到sequelize的事务，sql中事务是为了保证数据写入的时候一致性，保证多条语句要么同时成功或者失败
    return sequelize.transaction(async t => {
      await Favor.create({ artId: art_id, type, uid }, { transaction: t });
      const art = await Art.getData(art_id, type);
      // console.log('加 1');
      // by:1 表示加一，并注意书屋 transaction：t 的位置
      await art.increment('favNums', { by: 1, transaction: t });
    });
  }

  /**
   * 查询用户是否点赞过该期刊
   */
  static async userLikeIt(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id, type, uid,
      }
    });
    return favor ? true : false;
  }

  static async getMyClassicFavors(uid) {
    const arts = await Favor.findAll({
      where: {
        uid,
        //type Op.not是sequelize提供的一组方法，表示type不是400
        type: {
          [Op.not]: 400,
          //[]表示字符串，这里是字符串的意思，其他时候[]里面的内容也可以是表达式，表达前面被定义的变量
        }
      }
    });
    if (!arts) {
      throw new global.errors.NotFound();
    }
    //不能在数据库中使用for查询，因为for查询不可控，只能用in查询，把方法写到Art中去
    return await Art.getList(arts);
  }

  static async getBookFavor(uid, bookID) {
    const favorNums = await Favor.count({
      where: {
        artId: bookID, type: 400
      }
    });
    const myFavor = await Favor.findOne({
      where: {
        artId: bookID, uid, type: 400
      }
    });
    return {
      fav_nums: favorNums, like_status: myFavor ? true : false
    };
  }
}

Favor.init({
  uid: { type: DataTypes.INTEGER },
  artId: { type: DataTypes.INTEGER },
  type: { type: DataTypes.INTEGER }
}, {
  sequelize,
  modelName: 'favor'
});

module.exports = Favor;
