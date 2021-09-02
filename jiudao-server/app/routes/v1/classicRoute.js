const Router = require('@koa/router');
const Auth = require('../../../middleware/auth');
const { PositiveIntegerValidator } = require('../../validator/validator');
const router = new Router({ prefix: '/v1/classic' });

router.get('/:id', new Auth().m, async (ctx, next) => {
  // console.log('params:', ctx.params);
  // console.log('query:', ctx.query);
  // console.log('auth:', ctx.auth);

  const v = await new PositiveIntegerValidator().validate(ctx);

  ctx.body = {
    classic: 'classic get',
    params: ctx.params,
    query: ctx.query,
    id: v.get('path.id')
  };

  // throw new global.errors.NotFound();
});

module.exports = router;
