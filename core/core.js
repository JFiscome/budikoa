const config = require('config');
const Router = require('koa-router');
const parser = require('koa-bodyparser');
const logger = require('koa-logger');
const requireDirectory = require('require-directory');
const {initMysqlPoolConnection} = require('./mysql');

const {checkSalt} = require('../src/middleware/checkSalt');

const {catchError} = require('../src/middleware/catchError');

class CoreInit {
    static initProject(app) {
        CoreInit.app = app;

        /**
         * 挂载变量到global关键字上
         */
        CoreInit.argumentMountToGlobal();

        /**
         * 加载其他中间件
         */
        CoreInit.loadMiddleWares();

        /**
         * 加载路由
         */
        CoreInit.initLoadRouters();

        /**
         * 数据库连接池初始化
         */
        CoreInit.loadMysqlPoolConnection()

    }

    static argumentMountToGlobal() {
        global.config = config;

        // 挂载是否生产环境变量
        global.env = process.env.NODE_ENV === 'production' ? true : false;
    }


    static loadMysqlPoolConnection() {
        // 配置连接以及挂载mysqlPool数据库
        global.mysqlPool = initMysqlPoolConnection();
    }

    /**
     * 中间件代码前后顺序需严格排序
     * 日志记录中间件，tips日志一定要在异常捕获中间件的上面
     * 放在下面的话，一些http状态码就无法很好的体现出来
     * 遵从koa的洋葱模型
     * 加载异常捕获中间件--这个中间件应当放在最下面，洋葱的最内层
     * 以下顺序不可调换
     */
    static loadMiddleWares() {
        // 1
        CoreInit.app.use(parser());

        // 2
        CoreInit.app.use(logger());

        // 3
        CoreInit.app.use(catchError);

        // 4 校验头部盐
        if (global.env) CoreInit.app.use(checkSalt)

        // 5
        // 加载路由 在函数initLoadRouters中实现
    }


    /**
     * 加载路由 -- 自动加载路由项
     */
    static initLoadRouters() {
        const apiDirectoryPath = `${process.cwd()}/src/routes`;
        requireDirectory(module, apiDirectoryPath, {visit: whenLoadModule});

        function whenLoadModule(obj) {
            if (obj instanceof Router) {
                CoreInit.app.use(obj.routes()).use(obj.allowedMethods())
            }
        }
    }


}

module.exports = CoreInit;
