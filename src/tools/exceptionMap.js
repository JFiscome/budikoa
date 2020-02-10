const exceptionMap = new Map();


/**
 * server error
 */
exceptionMap.set('UNKNOWN_ERROR', {errorCode: -1, message: 'unknown error.', status: 500});
exceptionMap.set('SERVER_ERROR', {errorCode: 500000, message: 'server_error', status: 500});
exceptionMap.set('WX_OPENID_FAIL', {errorCode: 500001, message: 'wx openid is not correct.', status: 500});


/**
 * client error
 */
exceptionMap.set('CLIENT_ERROR', {errorCode: 400000, message: 'client error.', status: 400});
exceptionMap.set('INVALID_PARAMETER', {errorCode: 400001, message: 'invalid parameter.', status: 400});
exceptionMap.set('INVALID_OPERATION', {errorCode: 400002, message: 'invalid operation.', status: 400});
exceptionMap.set('PERMISSION_FORBIDDEN', {errorCode: 403001, message: 'permission forbidden.', status: 403});

const ErrorMap = {
    serverErr: 'SERVER_ERROR',
    clientErr: 'CLIENT_ERROR',
};


module.exports = {
    ErrorMap, exceptionMap
};

