const Router = require('@koa/router');
const Book = require('../../model/bookModel');
const HotBook = require('../../model/hotBookModel');
const { PositiveIntegerValidator } = require('../../validator/validator');
const router = new Router({ prefix: '/v1/book' });

/**
 * 获取热门书籍列表
 */
router.get('/hot_list', async ctx => {
  const books = await HotBook.getAll();
  ctx.body = { books };
});

/**
 * 获取书籍详情
 */
router.get('/:id/detail', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx);
  const book = new Book();
  ctx.body = await book.detail(v.get('path.id'));
});

module.exports = router;
