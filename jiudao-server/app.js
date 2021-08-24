const Koa = require('koa');
const InitManager = require('./core/init');

const app = new Koa(); // 实例化

InitManager.initCore(app);

const port = 3000;
app.listen(port, () => {
  console.log(`程序启动,请访问http://localhost:${ port }`);
});
