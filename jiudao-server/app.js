const Koa = require('koa');

const app = new Koa(); // 实例化

app.use(ctx => {
  ctx.body = { code: 0, message: '启动' };
});

const port = 3000;
app.listen(port, () => {
  console.log(`程序启动,请访问http://localhost:${ port }`);
});
