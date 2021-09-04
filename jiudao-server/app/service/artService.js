const { Op } = require('sequelize');
// const { flatten } = require('loadsh');
const { Movie, Sentence, Music } = require('../model/classicModel');

class Art {
  constructor(art_id, type) {
    this.art_id = art_id;
    this.type = type;
  }

  static async getData(art_id, type) {
    let arts = [];
    const finder = {
      where: {
        id: art_id
      }
    };

    switch (type) {
      case 100:
        arts = Movie.findOne(finder);
        break;
      case 200:
        
        break;
      case 300:
        
        break;
    
      default:
        break;
    }

    return arts;
  }
}

module.exports = Art;
