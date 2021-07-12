/**
 * 异常说明
 * code 400  服务器异常
 * code 201 成功
 * code 409 '参数错误'
 * code 404  资源找不到
 * code 403  禁止访问
 * code 401  授权失败
 * code 408 资源存在
 * code 0   失败
 */
class HttpException extends Error {
    constructor(msg = '服务器异常', errorCode = 10000, code = 400) {
        super()
        this.errorCode = errorCode
        this.code = code
        this.msg = msg
    }
}

class ParameterException extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 409
        this.msg = msg || '参数错误'
        this.errorCode = errorCode || 10000
    }
}

class Success extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 201
        this.msg = msg || 'ok'
        this.errorCode = errorCode || 1
    }
}

class NotFound extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '资源未找到'
        this.errorCode = errorCode || 10000
        this.code = 404
    }
}

class AuthFailed extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '授权失败'
        this.errorCode = errorCode || 10004
        this.code = 401
    }
}

class Forbbiden extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '禁止访问'
        this.errorCode = errorCode || 10006
        this.code = 403
    }
}

class ExistHttpException extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '邮箱已经存在'
        this.errorCode = errorCode || 10007
        this.code = 408
    }
}


module.exports = {
    HttpException,
    ParameterException,
    Success,
    NotFound,
    AuthFailed,
    Forbbiden,
    ExistHttpException
}