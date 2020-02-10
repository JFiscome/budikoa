const config = require('config');
const {initMysqlPoolConnection} = require('./core/mysql');
const initial = async () => {
    global.config = require('config');
    // 配置连接以及挂载elephant数据库
    global.mysqlPool = initMysqlPoolConnection();
};
module.exports = initial();
