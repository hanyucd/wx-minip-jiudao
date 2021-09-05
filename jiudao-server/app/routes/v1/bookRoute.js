const Router = require('@koa/router');
const HotBook = require('../../model/hotBookModel');
const router = new Router({ prefix: '/v1/book' });

// 获取热门书籍列表
router.get('/hot_list', async ctx => {
  const books = await HotBook.getAll();
  ctx.body = { books };
});

module.exports = router;
