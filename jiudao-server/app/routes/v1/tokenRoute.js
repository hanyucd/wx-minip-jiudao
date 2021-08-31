const Router = require('@koa/router');
const { LoginType } = require('../../lib/enum');
const User = require('../../model/userModel');
const { TokenValidator } = require('../../validator/validator');
const { generateToken } = require('../../../core/util');
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

router.post('/', async (ctx, next) => {
  const body = ctx.request.body;
  console.log('post 参数：', body);
  
  const v = await new TokenValidator().validate(ctx);

  console.log(typeof v.get('body.type'));

  let token;

  switch (Number(v.get('body.type'))) {
    case LoginType.USER_EMAIL:
      token = await _emailLogin(v.get('body.account'), v.get('body.secret'));
      break;
      
    case LoginType.USER_MINI_PROGRAM:
        
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
 * 
 * email登录
 * 普通用户
 *
 * @param {*} account 账户
 * @param {*} secret 密码
 */
const _emailLogin = async (account, secret) => {
  const user = await User.verifyEmailPassword(account, secret);
  // console.log(user.id);
  const _token = generateToken(user.id, 2);
  return _token;
};

module.exports = router;
