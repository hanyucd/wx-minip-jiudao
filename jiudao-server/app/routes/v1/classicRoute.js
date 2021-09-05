const Router = require('@koa/router');
const Auth = require('../../../middleware/auth');
const Favor = require('../../model/favorModel');
const Flow = require('../../model/flowModel');
const Art = require('../../service/artService');
const { PositiveIntegerValidator, ClassicValidator } = require('../../validator/validator');
const router = new Router({ prefix: '/v1/classic' });

/**
 * 查询最新一期期刊
 * 最新一期就是index最大的那个
 * note: 排序
 */
router.get('/latest', new Auth().m, async (ctx, next) => {
  const flow = await Flow.findOne({
    order: [
      ['index', 'DESC']
    ]
  });
  // console.log('flow: ', flow.toJSON());

  const art = await Art.getData(flow.artId, flow.type);
  art.setDataValue('flowIndex', flow.index);
  // console.log('art: ', art);

  ctx.body = art;
});

/**
 * 获取用户对某一期刊是否点赞
 */
router.get('/:type/:id/favor', new Auth().m, async (ctx, next) => {
  const v = await new ClassicValidator().validate(ctx);
  const id = v.get('path.id');
  const type = v.get('path.type');
  const art = await Art.getData(id, Number(type));
  if (!art) {
    throw new global.errors.NotFound();
  }
  const favor = await Favor.userLikeIt(id, type, ctx.auth.uid);
  ctx.body = {
    favNums: art,
    likeStatus: favor
  };
});

/**
 * 获取用户点赞过的期刊
 */
router.get('/favor', new Auth().m, async(ctx, next) => {
  const uid = ctx.auth.uid;
  ctx.body = await Favor.getMyClassicFavors(uid);
});

/**
 * 获取某一期刊详细信息
 */
router.get('/:type/:id', new Auth().m, async (ctx, next) => {
  const v = await new ClassicValidator().validate(ctx);
  const id = v.get('path.id');
  const type = parseInt(v.get('path.type'));

  //这里接口就用面向对象的方式编写，实例化Art
  //我们一般用纯静态的类编程，是面向过程的编程思想，我们需要培养面向对象的编程思想
  //如果一个类下面有好几十个静态方法，每个静态方法的调用都要接收大量的参数
  //但如果用实例方法来处理这个类的话，很多描述这个类特征的一些参数是可以通过constructor构造函数传递进来，这样就避免了在静态方法里面重复的去传参数，静态方法不太具有复用性。
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid);
  artDetail.art.setDataValue('like_status', artDetail.like_status);
  ctx.body = artDetail.art;
});

/**
 * 测试路由
 */
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
