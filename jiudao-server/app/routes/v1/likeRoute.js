const Router = require('@koa/router');
const router = new Router({ prefix: '/v1/like' });

router.get('/', (ctx, next) => {
  ctx.body = { like: 'like' };
});

module.exports = router;
