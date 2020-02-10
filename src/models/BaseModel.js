const moment = require('moment');
const blueBird = require('bluebird');

const utils = require('../tools/utils');

const {initIoRedisClient} = require('../../core/ioredis');


class BaseModel {
    constructor(idx) {
        this.redis = initIoRedisClient(idx);
        this.moment = moment;
        this.utils = utils;
    }

    static getInstance() {
        return new this();
    }

    async getConnection() {
        return new Promise((resolve, reject) => {
            global.mysqlPool.getConnection((err, connection) => {
                if (err) return reject(err);
                else return resolve(blueBird.promisifyAll(connection))
            })
        })
    }


    async querySql(sql, values) {
        if (!sql) throw new Error('querySql function without sql .');
        let connection = await this.getConnection();
        let result = await connection.queryAsync(sql, values);
        connection.release();
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
        let sql = `UPDATE ${table} SET \n`;
        let caseIds = [];
        for (let i = 0; i < fields.length; i++) {
            sql += ` ${fields[i]} = CASE ${caseField} \n`;
            for (let j = 0; j < infos.length; j++) {
                sql += ` WHEN ${infos[j][caseField]} THEN ${infos[j][fields[i]]}\n`;
                caseIds.push(infos[j][caseField])
            }
            sql += 'END ,'
        }
        sql = sql.substring(0, sql.length - 1);
        caseIds = [...new Set(caseIds)];
        sql += ` WHERE ${caseField} IN (${caseIds.join(',')}) `;
        return await this.querySql(sql)
    }

    /**
     * 执行事务
     */
    async execTransaction(valueDataS) {
        let result = [];
        let connection = await this.getConnection();
        await connection.beginTransactionAsync();
        try {
            for (let i = 0; i < valueDataS.length; i++) {
                let res = await connection.queryAsync(valueDataS[i].sql, valueDataS[i].data || []);
                result.push(res)
            }
        } catch (err) {
            await connection.rollbackAsync();
            throw err
        }
        await connection.commitAsync();
        connection.release();
        return result
    }

    /**
     * 计数
     * obj=>where后面的条件
     */
    async count(obj = {}, tableName) {
        let sql = `select count(*) as count from ?? `;
        let data = [tableName];
        sql = await this.__joinWithOptions(obj, sql);
        let countRes = await this.querySql(sql, data);
        return countRes[0] ? countRes[0].count : 0
    }

    /**
     * 新增
     * infos新增的数据
     */
    async insert(infos, tableName) {
        if (!infos || JSON.stringify(infos) === '{}') {
            throw new Error('insert object can not be null or empty object')
        }
        let fields = [], marks = [], data = [tableName];
        let sql = `insert into ?? `;
        for (let field in infos) {
            fields.push(field);
            marks.push('?');
            data.push(infos[field])
        }
        sql += `(${fields.join(',')}) values (${marks.join(',')})`;
        let insertRes = await this.querySql(sql, data);
        return insertRes.insertId
    }

    /**
     * 删除
     * obj where后面的条件
     */
    async delete(obj, tableName) {
        if (!obj || JSON.stringify(obj) === '{}') {
            throw new Error('delete object can not be null or empty object')
        }
        let conditions = [], data = [tableName];
        let sql = `delete from ?? where `;
        for (let field in obj) {
            conditions.push(`${field} = ?`);
            data.push(obj[field])
        }
        sql += conditions.join(' and ');
        return await this.querySql(sql, data)
    }

    /**
     * 更新
     * infos 需要被更新的数据
     * obj where后面的条件
     * infos: { status : 1}
     * obj :{id :100}
     */
    async update(infos, obj = {}, tableName) {
        if (!infos || JSON.stringify(infos) === '{}') {
            throw new Error('update object can not be null or empty object')
        }
        let sql = `update ?? set `;
        let conditions = [], data = [tableName];
        for (let field in infos) {
            conditions.push(`${field} = ?`);
            data.push(infos[field])
        }
        sql += conditions.join(',');
        // 具备条件
        sql = await this.__joinWithOptions(obj, sql);

        return await this.querySql(sql, data)
    }

    async __joinWithOptions(obj, sql) {
        if (obj && JSON.stringify(obj) !== '{}') {
            sql += ` where `;
            let fields = [];
            for (let field in obj) {
                fields.push(`${field} = ?`);
                data.push(obj[field])
            }
            sql += fields.join(' and ')
        }
        return sql
    }


    /**
     * 查找 -- 示例
     obj = {
     fields: ['id','name','age'],
     where: {
        status:1
     },
     order:[
       'id desc',
       'createTime asc'
     ],
     limit:5,
     offset:10
   }
     */
    async find(obj = {}, tableName) {
        let mark = '*';
        // 查询字段
        if (obj.fields) {
            if ((typeof obj.fields) !== 'object' || obj.fields.length < 0) {
                throw new Error('the fields should be Array type and not empty')
            }
            mark = obj.fields.join(',')
        }
        let sql = `select ${mark} from ??`;
        let data = [tableName];

        // 条件字段
        if (obj.where && JSON.stringify(obj.where) !== '{}') {
            if ((typeof obj.where) !== 'object') {
                throw new Error('the where condition should be Object type and not empty')
            }
            sql += ' where ';
            let conditions = [];
            for (let field in obj.where) {
                conditions.push(`${field} = ?`);
                data.push(obj.where[field])
            }
            sql += conditions.join(' and ')
        }

        // 排序字段
        if (obj.order) {
            if ((typeof obj.order) !== 'object' || obj.order.length < 0) {
                throw new Error('the order should be Array type and not empty')
            }
            sql += ` order by ${obj.order.join(',')}`
        }

        if (this.utils.intNumber(obj.limit)) {
            sql += ` limit ? `;
            data.push(this.utils.intNumber(obj.limit));
            if (this.utils.intNumber(obj.offset)) {
                sql += ` offset ? `;
                data.push(this.utils.intNumber(obj.offset))
            }
        }

        return await this.querySql(sql, data)
    }


}


module.exports = BaseModel;
