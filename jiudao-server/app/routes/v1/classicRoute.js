const Router = require('@koa/router');
const router = new Router({ prefix: '/v1/classic' });

router.get('/', (ctx, next) => {
  ctx.body = { classic: 'classic' };
});

module.exports = router;
