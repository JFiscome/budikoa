const {exceptionMap, ErrorMap} = require('../src/tools/exceptionMap');

function getExceptionInfo(errorType) {
    return exceptionMap.get(errorType) || exceptionMap.get('UNKNOWN_ERROR')
}

class HttpException extends Error {
    constructor(errorType, errorMsg) {
        super();
        const errorInfo = getExceptionInfo(errorType);
        this.errorCode = errorInfo.errorCode || 400001;
        this.message = errorMsg ? errorMsg : errorInfo.message || 'Error';
        this.statusCode = errorInfo.statusCode || 400
    }
}

class SuccessException extends HttpException {
    constructor(data = {}, message = 'ok', errorCode = 0, statusCode = 200) {
        super();
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data
    }
}

// 挂载成功处理函数
const success = (data, message, code, statusCode) => {
    throw new SuccessException(data, message, code, statusCode)
};

// 挂载异常处理函数
const fail = (type, message) => {
    throw new HttpException(type, message)
};


module.exports = {
    HttpException,
    SuccessException,
    ErrorMap,
    success,
    fail,
};
