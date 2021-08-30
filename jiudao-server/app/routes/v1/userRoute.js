const Router = require('@koa/router');
const User = require('../../model/userModel');
const { RegisterValidator } = require('../../validator/validator');
const router = new Router({ prefix: '/v1/user' });

/**
 * 注册
 */
router.post('/register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx);
  console.log(ctx.request.body);
  
  const user = {
    email: v.get('body.email'),
    password: v.get('body.password2'),
    nickname: v.get('body.nickname')
  };

  const result = await User.create(user); // 注册
  console.log('创建结果: ', result.id);
  console.log('创建结果 JSON 化: ', result.toJSON());

  ctx.body = { ...result.toJSON() };
});

module.exports = router;
