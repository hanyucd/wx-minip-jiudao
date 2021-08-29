const Router = require('@koa/router');
const router = new Router({ prefix: '/v1/classic' });

router.get('/:name', (ctx, next) => {
  console.log('params:', ctx.params);
  console.log('query:', ctx.query);

  console.log(global);

  ctx.body = {
    classic: 'classic get',
    params: ctx.params,
    query: ctx.query
  };

  throw new global.errors.NotFound();
});

router.post('/post', (ctx, next) => {

  console.log(ctx.request.body);
  
  ctx.body = {
    classic: 'classic post',
  };
});

module.exports = router;
