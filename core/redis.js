const redis = require('redis')
const blueBird = require('bluebird')
const initRedisClient = (dbx = 0, options = {}) => {
  let redisClient
  const host = global.config.get('redis.host')
  const port = global.config.get('redis.port')
  const pass = global.config.get('redis.pass')
  if (pass) options.auth_pass = pass

  if (host.indexOf('/') >= 0) {
    /* If redis.host contains a path name character, use the unix dom sock connection. ie, /tmp/redis.sock */
    redisClient = redis.createClient(host, options)
  } else {
    /* Else, connect over tcp/ip */
    redisClient = redis.createClient(port, host, options)
  }

  redisClient.on("error", function (err) {
    console.error("Error " + err)
  });

  /**
   * When connecting to a Redis server that requires authentication, 
   * the AUTH command must be sent as the first command after connecting. 
   * This can be tricky to coordinate with reconnections, the ready check, etc.
   * To make this easier, client.auth() stashes password and will send it after
   * each connection, including reconnections. callback is invoked only once, 
   * after the response to the very first AUTH command sent. NOTE: Your call 
   * to client.auth() should not be inside the ready handler. If you are doing this wrong
   * client will emit an error that looks something like this Error: 
   * Ready check failed: ERR operation not permitted.
   */
  if (pass) redisClient.auth(pass)
  if (dbx) redisClient.select(dbx)


  redisClient = blueBird.promisifyAll(redisClient)


  /** redis - batch */
  redisClient.batches = (array) => {
    return new Promise((resolve, reject) => {
      redisClient.batch(array).exec((err, replies) => {
        if (err) return reject(err);
        for (let i = 0; i < replies.length; i++) {
          if (replies[i] instanceof Error) {
            return reject(replies[i])
          }
        }
        return resolve(replies);
      })
    })
  }

  return redisClient
}

module.exports = { initRedisClient }