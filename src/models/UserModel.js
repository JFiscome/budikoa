const BaseModel = require('./BaseModel')
/**
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL COMMENT '用户名',
  `age` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '年龄',
  `gender` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1为男性，2为女性',
  `extend` text COMMENT '扩展字段',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
 */

class UserModel extends BaseModel {
  constructor() {
    super(global.config.get('database-redis.user'))
    this.dbName = global.config.get('mysql.database')
    this.keys = {
      userInfo: 'user:'
    }
  }

  async addNewUser(name, age, gender) {
    let sql = 'insert into ?? (`name`,`age`,`gender`) values (?,?,?)'
    let values = ['user', name, age, gender]
    let result = await this.querySql(sql, values)
    return result.insertId
  }

  async getUserInfo(uid) {
    let info = await this.redis.getAsync(this.keys.userInfo + uid)
    if (!info) {
      let sql = `select name,age,gender from ?? where id = ?`
      let values = ['user', uid]
      let result = await this.querySql(sql, values)
      info = result[0]
      await this.redis.setAsync(this.keys.userInfo + uid, JSON.stringify(info))
    } else {
      info = JSON.parse(info)
    }
    return info
  }


  async updateUserAge(uid, age) {
    let sql = `update ?? set age = ? where id = ?`;
    await this.querySql(sql, ['user', age, uid])
    await this.redis.expireAsync(this.keys.userInfo + uid, -1)
    return true
  }

  async deleteUser(uid) {
    return true
  }
}

module.exports = UserModel