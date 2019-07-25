const moment = require('moment')

const { initMysqlPoolConnection } = require('../../core/mysql')
const { initRedisClient } = require('../../core/redis')
class BaseModel {
  constructor(idx) {
    this.dbName
    this.redis = initRedisClient(idx)
    this.moment = moment
    this.defaultAvatar = 'http://img.xmhouse.com/avatar.png'
  }
  /**
   * function 前面有无 static
   * 有 static 静态方法，更多类似类的外部方法（this 关键字指向函数方法本身）
   * 无 static 普通类的属性，this指向外部的类
   */

  async querySql(sql, values) {
    return new Promise((resolve, reject) => {
      const pool = initMysqlPoolConnection(this.dbName)
      pool.getConnection((err, connection) => {
        if (err) return reject(err)
        connection.query(sql, values, (error, results) => {
          connection.release()
          if (error) return reject(error)
          else return resolve(results)
        })
      })
    })
  }

  async batchSql(sqlArray) {

  }

}

module.exports = BaseModel