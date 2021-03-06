const Router = require('@koa/router');
const requireDirectory = require('require-directory');
const httpException = require('./http-exception');

class InitManager {
  /*
   * 初始化核心方法
   */
  static initCore(app) {
    // 静态方法中的 this 指向类
    this.app = app;
    this.loadRouters();
    this.loadHttpException();
    this.loadConfig();
  }
  
  /**
   * 初始化加载路由
   */
  static loadRouters() {
    // 导入路径的所有模块
    const apiDir = `${ process.cwd() }/app/routes`;
    requireDirectory(module, apiDir, { visit: whenLoadModule });
    // 每当导入一个模块就会执行这个函数
    function whenLoadModule(obj) {
      // 判断自动加载的模块是否为路由类型
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes());
      }
    }
  }

  /**
   * 全局加载配置文件 挂载到 global 
   */
  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/index.js';
    const config = require(configPath);
    global.config = config;
  }

  /**
   * 全局加载异常处理方法 挂载到 global 
   */
  static loadHttpException() {
    global.errors = httpException;
  }
}

module.exports = InitManager;
