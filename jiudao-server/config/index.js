
module.exports = {
  env: 'dev',
  database: {
    dbName: 'koa-jiudao', // 数据库名
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root'
  },
  security: { // jwt秘钥
    secretKey: 'koa-jiudao-server', // 令牌key,一般要设置很复杂
    expiresIn: 60 * 60 * 24 * 30 // 过期时间
  },
  mp: {
    appid: 'wxdd8a10083014cf6a', // 微信小程序 appid
    appsecret: 'd0f4a5079e7f0310ca44166fd1404bff', // 微信小程序 secret
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  },
  yushu: {
    detailUrl: 'http://t.yushu.im/v2/book/id/%s',
    keywordUrl: 'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s',
  },
};
