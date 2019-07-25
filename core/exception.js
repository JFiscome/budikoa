const exceptionMap = require('../src/tools/exceptionMap')

function getExceptionInfo(errorType) {
  return exceptionMap.get(errorType) || exceptionMap.get('UNKNOWN_ERROR')
}

class HttpException extends Error {
  constructor(errorType, errorMsg) {
    super()
    const errorInfo = getExceptionInfo(errorType)
    this.errorCode = errorInfo.errorCode || 400001
    this.message = errorMsg ? errorMsg : errorInfo.message || 'Error'
    this.statusCode = errorInfo.statusCode || 400
  }
}

class Success extends HttpException {
  constructor(data = {}, message = 'ok', errorCode = 0, statusCode = 200) {
    super()
    this.errorCode = errorCode
    this.statusCode = statusCode
    this.message = message
    this.data = data
  }
}

module.exports = {
  HttpException,
  Success,
}