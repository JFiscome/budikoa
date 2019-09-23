const moment = require('moment')
const blueBird = require('bluebird')
// const { initRedisClient } = require('../../core/redis')
// 这边替换使用ioRedis
const { initIoRedisClient } = require('../../core/ioredis')
class BaseModel {
  constructor(idx) {
    this.dbName
    this.redis = initIoRedisClient(idx)
    this.moment = moment
    this.defaultAvatar = 'http://img.xmhouse.com/avatar.png'
  }

  async getConnection() {
    return new Promise((resolve, reject) => {
      global.elephantPool.getConnection((err, connection) => {
        if (err) return reject(err)
        else return resolve(blueBird.promisifyAll(connection))
      })
    })
  }


  async querySql(sql, values) {
    if (!sql) throw new Error('querySql function without sql .')
    let connection = await this.getConnection()
    let result = await connection.queryAsync(sql, values)
    connection.release()
    return result
  }

  /**
   * 批量更新MySQL数据
   * @param {*} table     =>  表名
   * @param {*} caseField =>  主要字段名  （id）
   * @param {*} fields    =>  更新字段名   (fieldA,fieldB)
   * @param {*} infos     =>  更新的数据   ([{id:1,fieldA:2,fieldB:2},{id:2,fieldA:3,fieldB:4}])
   */
  async batchUpdateSql(table, caseField, fields, infos) {
    let sql = `UPDATE ${table} SET \n`
    let caseIds = []
    for (let i = 0; i < fields.length; i++) {
      sql += ` ${fields[i]} = CASE ${caseField} \n`
      for (let j = 0; j < infos.length; j++) {
        sql += ` WHEN ${infos[j][caseField]} THEN ${infos[j][fields[i]]}\n`
        caseIds.push(infos[j][caseField])
      }
      sql += 'END ,'
    }
    sql = sql.substring(0, sql.length - 1)
    caseIds = [...new Set(caseIds)]
    sql += ` WHERE ${caseField} IN (${caseIds.join(',')}) `
    return await this.querySql(sql)
  }

  /**
   * 执行事务 
   */
  async execTransaction(validDatas) {
    let result = []
    let connection = await this.getConnection()
    await connection.beginTransactionAsync()
    try {
      for (let i = 0; i < validDatas.length; i++) {
        let res = await connection.queryAsync(validDatas[i].sql, validDatas[i].data || [])
        result.push(res)
      }
    } catch (err) {
      await connection.rollbackAsync()
      throw err
    }
    await connection.commitAsync()
    connection.release()
    return result
  }

}

module.exports = BaseModel