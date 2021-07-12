const {
    controller,
    get,
    post,
    required,
    authUser
} = require('../lib/decorator')
const {
    getUserOne,
    getUserOneByName,
} = require('../service/user')
const {ExistHttpException, HttpException} = require("../lib/httpException")
const {regEmail} = require('../utils/constant')

@controller('/mail')
class MailController {

    /**
     * @api {post} /users/mailCode  邮箱验证码接口
     * @apiName 发送验证码
     * @apiGroup mailCode
     * @apiParam {String} mail 邮箱
     *
     */
    @post("mailCode")
    @required({
        body: ['email']
    })
    async SendEmail(req, res) {
        let {email} = req.body;
        if (!regEmail.test(email)) {
            return res.send(new HttpException('邮箱格式不对', 0, 0))// 0失败 1成功
        }
        const user = await getUserOne(email)
        if (user) res.send(new ExistHttpException());
    }
}

module.exports = {
    MailController
}