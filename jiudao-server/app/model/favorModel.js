const { Model, DataTypes } = require('sequelize');
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
