const Router = require('@koa/router');
const Auth = require('../../../middleware/auth');
const { PositiveIntegerValidator } = require('../../validator/validator');
const router = new Router({ prefix: '/v1/classic' });

router.get('/:id', new Auth().m, async (ctx, next) => {
  // console.log('params:', ctx.params);
  // console.log('query:', ctx.query);
  // console.log('auth:', ctx.auth);

  const v = await new PositiveIntegerValidator().validate(ctx);

  ctx.body = {
    classic: 'classic get',
    params: ctx.params,
    query: ctx.query,
    id: v.get('path.id')
  };

  // throw new global.errors.NotFound();
});

module.exports = router;

/**
 * 数据库设计
 * 数据库设计是粗->细的过程
 * 1. 数据库主题有哪些
 * (1)user
 * 期刊 粗
 *  * (2)movie、(3)Sentence、(4)muisc
 * 如果把这三个模型都设计到期刊数据模型中是可以的，但是扩展性是比较差的
 * 相似性： 它们都有url,pubdate,title
 * movie中有导演
 * Sentence中有演员,
 * 如果都写在一起扩展性是不好的
 *
 * 2. 如何用数据表,标识一期一期的数据
 * 创建一个新的Model/表,来记录每一期的期刊
 * flow表:
 *
 * 3. 如何设计数据库,经验多了凭的是感觉
 ** movie、Sentence、muisc 和flow有什么区别?
 * * 实体表
 * movie、Sentence、muisc是一个实体,记录本身相关信息,
 * 实体表相当于大千世界的映射
 * 
 * * 业务表
 * flow很难找到一个具体的实体来体现,这个是抽象出来的,记录业务,用来解决业务问题的
 * * 业务表难点:
 *   (1)抽象
 *   (2)多变性:业务表没有一个具体的设计方式,存在着好/坏的业务表的区别
 *      好的业务表,会让我们操作数据表的时候变得简单,数据库性能好
 *      不好的业务表,会导致查询数据表变得繁琐,数据库性能不好
 *
 */
