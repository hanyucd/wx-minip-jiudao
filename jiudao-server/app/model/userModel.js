const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../../core/db');

class User extends Model {
  /**
   * 核对用户邮箱密码
   * @param {*} email 
   * @param {*} plainPassword
   * @memberof User
   */
  static async verifyEmailPassword(email, plainPassword) {
    const user = await User.findOne({
      where: { email }
    });
    // console.log('user:', user.toJSON());

    if (!user) throw new global.errors.AuthFailed('用户不存在');
    // 密码验证
    const correct = bcrypt.compareSync(plainPassword, user.password);
    console.log('密码校验:', correct);
    if (!correct) throw new global.errors.AuthFailed('密码不正确');
    return user;
  }

  /**
   * 根据 openid 查询
   * @param {*} openid
   */
  static async getUserByOpenid(openid) {
    const user = await User.findOne({
      where: { open_id: openid }
    });
    return user;
  }

  /**
   * 根据 openid 注册
   * @param {*} openid
   */
  static async registerByOpenid(openid) {
    return await User.create({
      open_id: openid
    });
  }
}

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
    // unique: true,
    unique: 'column',
    comment: '邮箱'
  },
  password: {
    type: DataTypes.STRING,
    // 获取器
    get() {
      const _password = this.getDataValue('password');
      return _password;
    },
    // 设置器
    set(value) {
      /**
       * 密码加密 盐
       * 10的意思: 指的是生成盐的成本,越大,花费成本越高,密码安全性越高,一般取默认值
       * 明文,相同密码加密之后也要不同,防止彩虹攻击
       */
      const salt = bcrypt.genSaltSync(10);
      const psw = bcrypt.hashSync(value, salt); // 加密
      this.setDataValue('password', psw);
    },
    comment: '密码'
  },
  open_id: {
    type: DataTypes.STRING(64),
    // unique: true, //指定唯一
    unique: 'column',
    comment: '微信小程序 openid'
  }
}, {
  sequelize, // 需要传递连接实例 (必传)
  modelName: 'user', // 模型名称
  initialAutoIncrement: 10000 // 自增初始值
});

module.exports = User;
