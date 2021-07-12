const {HttpException} = require('../lib/httpException')
/**
 * 创建捕获异常中间件
 * @param {*} app
 */
const catchError = app => app.use(async (req, res, next) => {
    try {
       await next()
    } catch (error) {
        const isHttpException = error instanceof HttpException

        if (!isHttpException) {
            throw error
        }
        let body = {}
        let status = {}
        if (isHttpException) {
            body = {
                msg: error.msg,
                error_code: error.errorCode,
                request: `${res.method} ${res.path}`
            }
            status = error.code
        } else {
            body = {
                msg: 'we made a mistake O(∩_∩)O~~',
                error_code: 999,
                request: `${res.method} ${res.path}`
            }
            status = 500
        }
        res.send(status,body)
    }
})
module.exports={
    catchError
}