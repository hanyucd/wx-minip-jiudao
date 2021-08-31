
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
};
