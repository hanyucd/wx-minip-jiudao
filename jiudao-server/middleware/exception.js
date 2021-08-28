
/**
 * 捕获错误
 */
const catchError = async (ctx, next) => {
  try {
    console.log('catchError', ctx.request);

    ctx.body = { catchError: 'catchError' };
    await next();
  } catch (error) {
    ctx.body = '服务器出错';
  }
};

module.exports = catchError;
