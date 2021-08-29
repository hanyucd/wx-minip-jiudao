/**
 * error 堆栈调用信息
 * error 简化清晰明了的信息,给前端
 * Http Status Code 2xx,4xx,5xx
 * 
 * -返回的信息：
 *  message
 *  error_code 详细,开发者自己定义的 10001 20003
 *  request_url 当前请求的url
 * 
 * -错误类型：
 *  *已知型错误
 *    参数校验错误
 *    明确处理错误
 *    try catch
 *  *未知型错误：
 *    程序潜在的错误,无意识的,根本就不知道他出错了
 *    连接数据库时,账号密码输错了
 */

const { HttpException } = require('../core/http-exception');
  
/**
 * 捕获错误
 */
const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log(error);
    // 抛出异常条件 判断是否是 HttpException 实例
    const isHttpException = error instanceof HttpException;
    const isDev = global.config.env === 'dev';

    if (isDev && !isHttpException) {
      throw error;
    }

    if (isHttpException) {
      ctx.body = {
        message: error.message,
        errorCode: error.errorCode,
        request: `${ ctx.method } ${ ctx.path }`
      };
      ctx.status = error.status; // 返回 http 状态码
    } else {
      ctx.body = {
        message: '未知错误',
        errorCode: 9999,
        request: `${ ctx.method } ${ ctx.path }`
      };
      ctx.status = 500;
    }
  }
};

module.exports = catchError;
