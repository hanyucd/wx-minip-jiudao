const util = require('util');
const axios = require('axios');

class MPManager {
  /**
   * 小程序登录逻辑
   * 1. 小程序生成code发送给服务端
   * 2. 服务端拿着code请求微信服务端
   * 3. 请求成功微信服务端返回openid(唯一标识);鉴定用户是否合法
   * 
   * 小程序端没有显示的注册
   * 4. 请求微信服务
   * 微信服务传参形式
   * https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
   * code 动态生成
   * appid appsecret
   * 通过微信服务url传递参数请求服务器
   */
  static async codeToToken(code) {
    // 格式化 url
    const sessionUrl = util.format(
      global.config.mp.loginUrl,
      global.config.mp.appid,
      global.config.mp.appsecret,
      code
    );

    const result = await axios.get(sessionUrl);
    console.log('mp登录:', result);

    if (result.status !== 200) {
      throw new global.errors.AuthFailed('openid 获取失败');
    }
    // 微信响应返回中的错误信息
    const errcode = result.data.errcode;
    const errmsg = result.data.errmsg;
    if (errcode) {
      throw new global.errs.AuthFailed('openid获取失败' + errmsg, errcode);
    }
  }
}

module.exports = MPManager;
