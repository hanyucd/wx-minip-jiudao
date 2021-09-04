const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../core/db');

/**
 * 期刊模型
 * 定义表名,描述相应的实体
 * movie、Sentence、muisc 合成称为classic
 * movie、Sentence、muisc、book 合成称为art
 * 
 * 共同字段/属性
 * image,title,pubdate,content,fav_nums,type(代号)
 * 不同: music: url
 * 
 * 因为有共同字段/属性,先定义一个基类,让其他类继承这个基类
 */

// 通用字段
const classicFields = {
  title: { type: DataTypes.STRING },
  type: { type: DataTypes.TINYINT },
  image: { type: DataTypes.STRING },
  content: { type: DataTypes.STRING },
  pubdate: { type: DataTypes.DATEONLY },
  favNums: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
};

// Movie 模型
class Movie extends Model {}
Movie.init(classicFields, {
  sequelize,
  modelName: 'movie'
});

// Sentence 模型
class Sentence extends Model {}
Sentence.init(classicFields, {
  sequelize,
  modelName: 'sentence'
});

// Music 模型
const musicFields = Object.assign(classicFields, { url: { type: DataTypes.STRING } });
class Music extends Model {}
Music.init(musicFields, {
  sequelize,
  modelName: 'music'
});

module.exports = {
  Movie,
  Sentence,
  Music
};
