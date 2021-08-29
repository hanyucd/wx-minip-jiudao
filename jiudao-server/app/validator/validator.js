const { LinValidator, Rule } = require('../../core/lin-validator');
const User = require('../model/userModel');

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '需要是正整数', { min: 1 })
    ];
  }
}

/**
 * 注册校验
 *
 * @class RegisterValidator
 * @extends {LinValidator}
 */
class RegisterValidator extends LinValidator {
  constructor() {
    super();
    this.email = [
      new Rule('isEmail', '不符合Email规范')
    ];
    this.password1 = [
      // 用户密码指定范围,密码强度
      new Rule('isLength', '密码至少6个字符,最多32个字符', {
        min: 6,
        max: 32
      }),
      new Rule('matches', '密码必须包含数字、大写英文字母、小写英文字母', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
    ];
    this.password2 = this.password1;
    this.nickname = [
      new Rule('isLength', '昵称至少2个字符,最多32个字符', {
        min: 2,
        max: 32
      })
    ];
  }
  // 前缀必须是validate
  validatePassword(vals) {
    const psw1 = vals.body.password1;
    const psw2 = vals.body.password2;
    if (psw1 !== psw2) {
      throw new Error('两个密码必须相同');
    }
  }
  async validateEmail(vals) {
    const email = vals.body.email;
    const user = await User.findOne({
      where: {
        email: email
      }
    });
    if (user) {
      throw new Error('Email已经存在');
    }
  }
}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator
};
