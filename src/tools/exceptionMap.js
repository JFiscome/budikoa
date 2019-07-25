const exceptionMap = new Map();


/**
 * server error
 */
exceptionMap.set('UNKNOWN_ERROR', { errorCode: -1, message: 'unknown error.', status: 500 })
exceptionMap.set('WX_OPENID_FAIL', { errorCode: 500001, message: 'wx openid is not correct.', status: 500 })


/**
 * client error
 */
exceptionMap.set('INVALID_PARAMETER', { errorCode: 400001, message: 'invalid paramter.', status: 400 })
exceptionMap.set('INVALID_OPERATION', { errorCode: 400002, message: 'invalid operation.', status: 400 })
exceptionMap.set('PERMISSION_FORBIDDEN', { errorCode: 403001, message: 'permission forbidden.', status: 403 })
module.exports = exceptionMap