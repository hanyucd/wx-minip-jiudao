const basicAuth = require('basic-auth');
const jwt = require('jsonwebtoken');

class Auth {
  constructor() {

  }

  get m() {
    return async (ctx, next) => {
      const userToken = basicAuth(ctx.req);

      // console.log(userToken);
      ctx.body = userToken;
    };
  }
}

module.exports = Auth;
