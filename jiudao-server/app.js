const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const InitManager = require('./core/init');
const catchError = require('./middleware/exception');

require('./app/model/userModel');

const app = new Koa(); // 实例化

app.use(bodyParser());
app.use(catchError); // 全局捕获异常
InitManager.initCore(app);

const port = 3000; // 端口号
app.listen(port, () => {
  console.log(`程序启动,请访问http://localhost:${ port }`);
});
