const { Op } = require('sequelize');
const { flatten } = require('lodash');
const { Movie, Sentence, Music } = require('../model/classicModel');

class Art {
  constructor(art_id, type) {
    this.art_id = art_id;
    this.type = type;
  }

  /**
   * 查询详情
   */
  async getDetail(uid) {
    // 注意：局部导入，避免导入循环
    const Favor = require('../model/favorModel');
    const art = await Art.getData(this.art_id, this.type);
    if (!art) {
      throw new global.errs.NotFound();
    }
    const favor = await Favor.userLikeIt(this.art_id, this.type, uid);
    return { art, like_status: favor };
  }
  
  static async getData(art_id, type) {
    let art = [];
    const finder = {
      where: {
        id: art_id
      }
    };

    switch (type) {
      case 100:
        art = await Movie.findOne(finder);
        break;
      case 200:
        art = await Music.findOne(finder);
        break;
      case 300:
        art = await Sentence.findOne(finder);
        break;
    
      default:
        break;
    }

    return art;
  }

  static async getList(artInfoList) {
    //用in查询方式，3个arts 3次in查询,我们一般都不会对数据库职别遍历查询,会影响性能
    const artInfoObj = {
      100: [],
      200: [],
      300: []
    };
    for (let artInfo of artInfoList) {
      artInfoObj[artInfo.type].push(artInfo.art_id);
    }
    
    const arts = [];
    for (let key in artInfoObj) {
      //这里可能存在key是空值，length为0的情况，所以需要判断一下如果是0进行跳出
      const ids = artInfoObj[key];
      if (ids.length === 0) {
        continue;
      }
      //key因为上面artInfoObj传入的，但是artInfoObj对象中的键值对前面的值是字符串，这里要转换int
      key = parseInt(key);
      arts.push(await Art._getListByType(ids, key));
    }
    return flatten(arts);
    // arts.push 的内容是数组，数组 push 到数组中变成了二维的数组
    // 需要把二维数组直接变成一维数组，用 lodash 内置的方法
  }

  static async _getListByType(ids, type) {
    const finder = {
      where: {
        id: {
          //Op.in是sequelize提供的一组方法，表示id in ids
          [Op.in]: ids
        },
      }
    };
    let arts = [];
    switch (type) {
      case 100:
        arts = await Movie.findAll(finder);
        break;
      case 200:
        arts = await Music.findAll(finder);
        break;
      case 300:
        arts = await Sentence.findAll(finder);
        break;
      case 400:
        break;
      default:
        break;
    }
    return arts;
  }
}

module.exports = Art;
