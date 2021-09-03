const Router = require('@koa/router');
const { LoginType } = require('../../lib/enum');
const User = require('../../model/userModel');
const { TokenValidator, NotEmptyValidator } = require('../../validator/validator');
const { generateToken } = require('../../../core/util');
const Auth = require('../../../middleware/auth');
const MPManager = require('../../service/mpService');
const router = new Router({ prefix: '/v1/token' });

/**
 * 登录
 * session 考虑状态  无状态
 * email password
 * 
 * 2. 令牌获取 颁布令牌
 * token 无意义的随机字符串
 * jwt 可以携带数据
 */

/**
 * 业务逻辑写在哪
 * 1. 在API接口编写(简单的)
 * 2. Model(对于web分层架构来说都写在Model里)
 * 
 * MVC模式 业务逻辑写在Model里
 * 
 * 业务分层
 * -简单的业务,写在Model里
 * -复杂的业务,在Model上面在加一层Service
 * -Thinkphp Model Service Logic
 * -java Model DTO
 */

router.post('/', async (ctx, next) => {
  const body = ctx.request.body;
  console.log('post 参数：', body);
  // 根据type类型,执行不同的登录方法
  // API 权限 非公开api需要token才能访问
  // token 过期/不合法 就不能访问api
  
  const v = await new TokenValidator().validate(ctx);
  console.log(typeof v.get('body.type'));

  let token;
  
  switch (Number(v.get('body.type'))) {
    case LoginType.USER_EMAIL:
      // web 账号 + 密码登录
      token = await _emailLogin(v.get('body.account'), v.get('body.secret'));
      break;
      
    case LoginType.USER_MINI_PROGRAM:
      // 小程序
      token = await MPManager.codeToToken(v.get('body.account'));
      break;

    case LoginType.ADMIN_EMAIL:
      // admin
      break;
    default:
      throw new global.errors.ParameterException('没有相应的处理函数');
  }
  
  ctx.body = { token };
});

/**
 * 验证令牌是否有效
 */
router.post('/verify', async (ctx, next) => {
  const v = await new NotEmptyValidator().validate(ctx);

  const result = await Auth.verifyToken(v.get('body.token'));
  ctx.body = { is_valid: result };
});

/**
 * email登录
 * 普通用户
 * @param {*} account 账户
 * @param {*} secret 密码
 */
const _emailLogin = async (account, secret) => {
  const user = await User.verifyEmailPassword(account, secret);
  // console.log(user.id);
  const _token = generateToken(user.id, Auth.USER);
  return _token;
};

module.exports = router;
