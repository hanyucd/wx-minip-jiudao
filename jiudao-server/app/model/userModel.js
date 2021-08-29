const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../../core/db');

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 设置主键
    autoIncrement: true, // 自动增长
  },
  nickname: {
    type: DataTypes.STRING,
    defaultValue: '',
    comment: '昵称'
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    comment: '邮箱'
  },
  password: {
    type: DataTypes.STRING,
    comment: '密码'
  },
  open_id: {
    type: DataTypes.STRING(64),
    unique: true, //指定唯一
    comment: '微信小程序 openid'
  }
}, {
  sequelize, // 需要传递连接实例 (必传)
  modelName: 'user', // 模型名称
  initialAutoIncrement: 10000 // 自增初始值
});

module.exports = User;
