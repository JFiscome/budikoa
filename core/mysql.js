const mysql = require('mysql')

const initMysqlPoolConnection = (database = global.config.get('mysql.database')) => {
  const pool = mysql.createPool({
    connectionLimit: global.config.get('mysql.connectionLimit'),
    host: global.config.get('mysql.host'),
    user: global.config.get('mysql.user'),
    password: global.config.get('mysql.password'),
    database: database
  })
  return pool
}

module.exports = {initMysqlPoolConnection}