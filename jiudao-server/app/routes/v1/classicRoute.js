const Router = require('@koa/router');
const { PositiveIntegerValidator } = require('../../validator/validator');
const router = new Router({ prefix: '/v1/classic' });

router.get('/:id', async (ctx, next) => {
  console.log('params:', ctx.params);
  console.log('query:', ctx.query);

  const v = await new PositiveIntegerValidator().validate(ctx);

  console.log('v', v);

  ctx.body = {
    classic: 'classic get',
    params: ctx.params,
    query: ctx.query,
    id: v.get('path.id')
  };

  // throw new global.errors.NotFound();
});

router.post('/post', (ctx, next) => {

  console.log(ctx.request.body);
  
  ctx.body = {
    classic: 'classic post',
  };
});

module.exports = router;
