const BaseModel = require('./BaseModel');


class VirusModel extends BaseModel {
    constructor() {
        super();
        this.tableName = {
            area: 'ncov_area',
            case: 'ncov_case'
        };
        this.keyMap = {
            areaObj: 'area:object'
        }
    }

    // 获取城市列表
    async getAreaList(page, size) {
        let areaObj = {};
        let areaStr = await this.redis.get(this.keyMap.areaObj);
        if (areaStr) {
            console.log('in redis');
            areaObj = JSON.parse(areaStr)
        } else {
            console.log('in mysql.')
            let {limit, offset} = this.utils.getPageLimitAndOffset(page, size);
            let sql = `select * from ?? where level = ? limit ? offset ?`;
            let data = [this.tableName.area, 0, limit, offset];
            areaObj = await this.querySql(sql, data);
            await this.redis.set(this.keyMap.areaObj, JSON.stringify(areaObj))
        }

        return areaObj
    }
}

module.exports = VirusModel;
