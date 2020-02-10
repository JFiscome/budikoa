const TokenService = {};
const {fail, ErrorMap} = require('../../core/exception');
const jwt = require('jsonwebtoken');
const privateKey = global.config.get('token.PrivateKey');
const expiresIn = global.config.get('token.expiresIn');


TokenService.generateToken = async (info = {}) => {
    return jwt.sign(info, privateKey, {expiresIn: expiresIn})
};

TokenService.verifyToken = async (token) => {
    try {
        return jwt.verify(token, privateKey)
    } catch (e) {
        let errMsg = 'forbidden.';
        if (e.name === 'TokenExpiredError') {
            errMsg = 'token expired.'
        }
        fail(ErrorMap.clientErr, errMsg)
    }
};

module.exports = TokenService;
