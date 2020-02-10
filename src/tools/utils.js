const crypto = require('crypto');
const getHttpSalt = (timestamp) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const string = [year, month, day, global.config.get('httpSalt'), timestamp].join('-');
    return crypto.createHash('md5').update(string).digest('hex');
};

const sleep = (milliseconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds)
    })
};


const redisExpireTime = () => {
    return parseInt(global.config.get('redis.expire')) + Math.ceil(Math.random() * 60 * 60 * 2)
};

const findMembers = function (instance, {prefix, specifiedType, filter}) {
    // 递归函数
    function _find(instance) {
        //基线条件（跳出递归）
        if (instance.__proto__ === null)
            return [];

        let names = Reflect.ownKeys(instance);
        names = names.filter((name) => {
            // 过滤掉不满足条件的属性或方法名
            return _shouldKeep(name)
        });

        return [...names, ..._find(instance.__proto__)]
    }

    function _shouldKeep(value) {
        if (filter) {
            if (filter(value)) {
                return true
            }
        }
        if (prefix)
            if (value.startsWith(prefix))
                return true;
        if (specifiedType)
            if (instance[value] instanceof specifiedType)
                return true
    }

    return _find(instance)
};


const getPageStartAndEnd = (page, size) => {
    if (!page || !size) {
        throw new Error('getPageStartAndEnd parameters can not be null')
    }
    const start = (page - 1) * size;
    const end = page * size - 1;
    return {start, end}
};

const getPageLimitAndOffset = (page, size) => {
    if (!page || !size) {
        throw new Error('getPageLimitAndOffset parameters can not be null')
    }
    const offset = (page - 1) * size;
    const limit = size;
    return {offset, limit}
};


const intNumber = (_number) => {
    return (_number && parseInt(_number) && parseInt(_number) > 0) ? parseInt(_number) : 0;
};




module.exports = {
    findMembers,
    getHttpSalt,
    redisExpireTime,
    sleep,
    getPageStartAndEnd,
    getPageLimitAndOffset,
    intNumber,
};
