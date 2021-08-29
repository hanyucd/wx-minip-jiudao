/**
 * 自定义异常处理基类
 * @class HttpException
 * @extends {Error}
 */
class HttpException extends Error {
  constructor(message = '服务器异常', errorCode = 10000, status = 400) {
    super();
    this.errorCode = errorCode;
    this.message = message;
    this.status = status;
  }
}

/**
 * 扩展异常处理基类 400
 * @class ParameterException
 * @extends {HttpException}
 */

class ParameterException extends HttpException {
  constructor(message, errorCode) {
    super(message = '参数错误', errorCode = 10001);
  }
}

class NotFound extends HttpException {
  constructor(message, errorCode, status) {
    super(message = '资源未找到', errorCode = 10002, status = 404);
  }
}

module.exports = {
  HttpException,
  ParameterException,
  NotFound
};
