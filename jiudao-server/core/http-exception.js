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

class Success extends HttpException {
  constructor(message, errorCode, status) {
    super(message = message || '成功', errorCode = 0, status = 201);
  }
}

class AuthFailed extends HttpException {
  constructor(message, errorCode, status) {
    super(message = message || '授权失败', errorCode = errorCode || 10004, status = 401);
  }
}

class Forbbiden extends HttpException {
  constructor(message, errorCode, status) {
    super(message = message || '禁止访问', errorCode = errorCode || 10006, status = 403);
  }
}

class LikeError extends HttpException {
  constructor(message, errorCode, status) {
    super(message = message || '你已经点赞过', errorCode = errorCode || 60001, status = 400);
  }
}

class DislikeError extends HttpException {
  constructor(message, errorCode, status) {
    super(message = message || '你已取消点赞', errorCode = errorCode || 60002, status = 400);
  }
}

module.exports = {
  HttpException,
  ParameterException,
  NotFound,
  Success,
  AuthFailed,
  Forbbiden,
  LikeError,
  DislikeError
};
