const TokenService = require('../services/token')
const Auth = {}
Auth.auth = async (ctx, next) => {
    //首先获取token
    let token = ctx.header.token
    if (!token) {
        global.fail('PERMISSION_FORBIDDEN')
    }
    ctx.user = await TokenService.verifyToken(token)
    await next()
}

Auth.appendUid = async (ctx, next) => {
    let token = ctx.header.token
    if (!token) {
        let user = { uid: 0 }
        ctx.user = user
    } else {
        ctx.user = await TokenService.verifyToken(token)
    }
    await next()
}

module.exports = Auth