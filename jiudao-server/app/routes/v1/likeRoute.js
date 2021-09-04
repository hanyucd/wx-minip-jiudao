const Router = require('@koa/router');
const Auth = require('../../../middleware/auth');
const Favor = require('../../model/favorModel');
const { LikeValidator } = require('../../validator/validator');
const router = new Router({ prefix: '/v1/like' });

router.post('/', new Auth().m, async (ctx, next) => {
  const v = await new LikeValidator().validate(ctx, {
    id: `art_id` // 传入别名,验证的时候验证art_id,不是id
  });
  // console.log('like:', v.get('body.art_id'), v.get('body.type'));

  await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid);
  
  ctx.body = { like: 'like' };
});

module.exports = router;
