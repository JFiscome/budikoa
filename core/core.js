const config = require('config')
const Router = require('koa-router')
const parser = require('koa-bodyparser')
const logger = require('koa-logger')
const requireDirectory = require('require-directory')
const { initMysqlPoolConnection } = require('./mysql')


const { catchError } = require('../src/middleware/catchError')

const { HttpException, Success } = require('./exception')

class CoreInit {
  static initProject(app) {
    CoreInit.app = app

    /**
     * 挂载变量到global关键字上
     */
    CoreInit.argumentMountToGolbal()

    /**
     * 加载其他中间件
     */
    CoreInit.loadMiddlewares()

    /**
     * 加载路由
     */
    CoreInit.initLoadRouters()

    /**
     * 数据库连接池初始化
     */
    CoreInit.loadMysqlPoolConnection()

  }

  static argumentMountToGolbal() {

    // 挂载config配置文件
    global.config = config

    // 挂载是否生产环境变量
    global.env = process.env.NODE_ENV === 'production' ? true : false

    // 挂载异常处理函数
    global.fail = (type, message) => {
      throw new HttpException(type, message)
    }

    // 挂载成功处理函数
    global.success = (data, message, code, statusCode) => {
      throw new Success(data, message, code, statusCode)
    }
  }

  /**
   * 中间件代码前后顺序需严格排序
   * 日志记录中间件，tips日志一定要在异常捕获中间件的上面
   * 放在下面的话，一些http状态码就无法很好的体现出来
   * 遵从koa的洋葱模型
   * 加载异常捕获中间件--这个中间件应当放在最下面，洋葱的最内层
   * 以下顺序不可调换
   */
  static loadMiddlewares() {
    // 1
    CoreInit.app.use(parser())

    // 2
    CoreInit.app.use(logger())

    // 3
    CoreInit.app.use(catchError)

    // 4
    // 加载路由 在函数initLoadRouters中实现
  }


  /**
   * 加载路由 -- 自动加载路由项
   */
  static initLoadRouters() {
    const apiDirectoryPath = `${process.cwd()}/src/routes`
    requireDirectory(module, apiDirectoryPath, { visit: whenLoadModule })
    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        CoreInit.app.use(obj.routes()).use(obj.allowedMethods())
      }
    }
  }


  static loadMysqlPoolConnection() {
    // 配置连接以及挂载elephant数据库
    const elephantPool = initMysqlPoolConnection(global.config.get('mysql.database'))
    global.elephantPool = elephantPool
  }

}

module.exports = CoreInit