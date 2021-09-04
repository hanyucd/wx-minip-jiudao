const { Op } = require('sequelize');
// const { flatten } = require('loadsh');
const { Movie, Sentence, Music } = require('../model/classicModel');

class Art {
  constructor(art_id, type) {
    this.art_id = art_id;
    this.type = type;
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
}

module.exports = Art;
