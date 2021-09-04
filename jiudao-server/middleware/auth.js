const basicAuth = require('basic-auth');
const jwt = require('jsonwebtoken');

class Auth {
  constructor(level) {
    // 定义权限
    this.level = level || 1;

    //note: 定义权限类常量
    Auth.USER = 8; // 用户
    Auth.ADMIN = 16; // admin
    Auth.SUPER_ADMIN = 32; // 超级admin
  }

  get m() {
    return async (ctx, next) => {
      const userToken = basicAuth(ctx.req);

      let errMsg = 'token不合法';
      console.log(userToken);
      if (!userToken || !userToken.name) {
        throw new global.errors.Forbbiden(errMsg);
      }

      try {
        var decode = jwt.verify(userToken.name, global.config.security.secretKey);
        console.log('decode:', decode);

      } catch (error) {
        // console.log('error:', decode);
        if (error.name === 'TokenExpiredError') {
          errMsg = 'token已过期';
          throw new global.errors.Forbbiden(errMsg);
        }
      }
      if (decode.scope < this.level) {
        errMsg = '权限不足';
        throw new global.errors.Forbbiden(errMsg);
      }
      
      // 将解析出来的信息添加到 ctx 上，供后面的路由获取使用
      ctx.auth = { uid: decode.uid, scope: decode.scope };
      await next();
    };
  }

  /**
   * 验证令牌是否有效
   */
  static verifyToken(token) {
    try {
      jwt.verify(token, global.config.security.secretKey);
      console.log('验证 token:', token);
      
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = Auth;
