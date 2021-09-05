const { LinValidator, Rule } = require('../../core/lin-validator');
const { LoginType, ArtType } = require('../lib/enum');
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

/**
 * 登录校验
 *
 * @class TokenValidator
 * @extends {LinValidator}
 */
class TokenValidator extends LinValidator {
  constructor() {
    super();
    // 账号
    this.account = [
      new Rule('isLength', '不符合账号规则', { min: 4, max: 32 })
    ];
    // 密码
    this.secret = [
      /**
       * 是必须要传入的吗
       * web 账号+密码
       * 登录 多元化 小程序登录不需要校验密码
       * 微信打开小程序 已经验证了合法用户了
       * web account + secret
       * 小程序 account
       * 手机号登录
       * 1. 可以为空,可以不传
       * 2. 空 不为空
       */
      new Rule('isOptional'),
      new Rule('isLength', '至少6个字符', { min: 6, max: 128 })
    ];
    // 验证登录方式 type JS 枚举
  }
  validateLoginType(vals) {
    if (!vals.body.type) {
      throw new Error('type是必传参数');
    }
    if (!LoginType.isThisType(Number(vals.body.type))) {
      throw new Error('type参数不合法');
    }
  }
}

/**
 * 校验 token 是否为空
 * @extends {LinValidator}
 */
class NotEmptyValidator extends LinValidator {
  constructor() {
    super();
    this.token = [
      new Rule('isLength', '不允许为空', { min: 1 })
    ];
  }
}

const checkArtType = vals => {
  let type = vals.body.type || vals.path.type;
  if (!type) {
    throw new Error('type是必须参数');
  }
  type = parseInt(type);

  if (!ArtType.isThisType(type)) {
    throw new Error('type参数不合法');
  }
};

class LikeValidator extends PositiveIntegerValidator {
  constructor() {
    super();
    this.validateType = checkArtType;
  }
}

class ClassicValidator extends LikeValidator {}

class SearchValidator extends LinValidator {
  constructor() {
    super();
    this.q = [
      new Rule('isLength', '搜索关字不能为空', { min: 1, max: 16 })
    ];
    //分页 start, count 从start开始取,count表示取几条
    //有可能客户start,count都不传,就是默认default
    this.start = [
      new Rule('isInt', 'start不符合规范', { min: 0, max: 60000 }),
      new Rule('isOptional', '', 0) //默认校验isOptional,默认从0条开始查询
    ];
    this.count = [
      new Rule('isInt', 'count不符合规范', {
        min: 1,
        max: 20
      }),
      new Rule('isOptional', '', 20)
    ];
  }
}

class AddShortCommentValidator extends PositiveIntegerValidator {
  constructor() {
    super();
    this.content = [
      new Rule('isLength', '必须在1-12个字符之间', {
        min: 1,
        max: 12
      })
    ];
  }
}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  LikeValidator,
  ClassicValidator,
  SearchValidator,
  AddShortCommentValidator
};
