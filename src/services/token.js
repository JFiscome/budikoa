const TokenService = {}

const jwt = require('jsonwebtoken')
const privateKey = global.config.get('token.PrivateKey')
const expiresIn = global.config.get('token.expiresIn')


TokenService.generateToken = async (info = {}) => {
  return jwt.sign(info, privateKey, { expiresIn: expiresIn })
}

TokenService.verifyToken = async (token) => {
  try {
    return jwt.verify(token, privateKey)
  } catch (e) {
    let errMsg = 'token forbidden'
    if (e.name == 'TokenExpiredError') {
      errMsg = 'token expired.'
    }
    global.fail('PERMISSION_FORBIDDEN', errMsg)
  }
}

module.exports = TokenService