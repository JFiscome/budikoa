const mysql = require('mysql')

/**
 * 一个项目暂支持一个mysql数据库
 */
const initMysqlPoolConnection = () => {
    const msConf = global.config.get('mysql');
    const pool = mysql.createPool({
        connectionLimit: msConf.connectionLimit,
        host: msConf.host,
        user: msConf.user,
        password: msConf.password,
        database: msConf.database,
        charset: msConf.charset,
    })
    return pool
}

module.exports = {initMysqlPoolConnection}
