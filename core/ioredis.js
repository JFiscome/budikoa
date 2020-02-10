const ioredis = require('ioredis');

const initIoRedisClient = (dbx = 0, options = {}) => {
    const rsConf = global.config.get('redis');
    options.host = rsConf.host;
    options.port = rsConf.port;
    if (rsConf.password) options.password = rsConf.password;
    options.db = dbx;
    return new ioredis(options)
};

module.exports = {initIoRedisClient};
