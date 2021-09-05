const Router = require('@koa/router');
const Auth = require('../../../middleware/auth');
const Book = require('../../model/bookModel');
const Comment = require('../../model/commentModel');
const Favor = require('../../model/favorModel');
const HotBook = require('../../model/hotBookModel');
const { PositiveIntegerValidator, SearchValidator, AddShortCommentValidator } = require('../../validator/validator');
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

/**
 * 搜索图书
 */
router.get('/search', async (ctx, next) => {
  const v = await new SearchValidator().validate(ctx);
  const result = await Book.searchFromYuShu(v.get('query.q'), v.get('query.start'), v.get('query.count'));
  ctx.body = result;
});

/**
 * 获取书籍点赞情况
 */
router.get('/:book_id/favor', new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, { id: 'book_id' });
  ctx.body = await Favor.getBookFavor(ctx.auth.uid, parseInt(v.get('path.book_id'), 10));
});

/**
 * 获取我喜欢的书籍的数量
 */
router.get('/favor/count', new Auth().m, async (ctx, next) => {
  const count = await Book.getMyFavorBookCount(ctx.auth.uid);
  ctx.body = { count };
});

/**
 * 增加短评
 */
router.post('/add/short_comment', new Auth().m, async ctx => {
  const v = await new AddShortCommentValidator().validate(ctx, { id: 'book_id' });
  const result = await Comment.addComment(v.get('body.book_id'), v.get('body.content'));
  ctx.body = { result };
});

/**
 * 获取书籍短评
 */
router.get('/:book_id/short_comment', new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, { id: 'book_id' });
  const book_id = v.get('path.book_id');
  const bookcomments = await Comment.getBookComments(book_id);
  ctx.body = { bookcomments, book_id };
});

module.exports = router;
