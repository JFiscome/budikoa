const ioredis = require('ioredis')

const initIoRedisClient = (dbx = 0, options = {}) => {
  options.host = global.config.get('redis.host')
  options.port = global.config.get('redis.port')
  const pass = global.config.get('redis.pass')
  if (pass) options.password = pass
  options.db = dbx

  const redisClient = new ioredis(options)
  return redisClient
}

module.exports = { initIoRedisClient }