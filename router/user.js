const {
    controller,
    get,
    post,
    authUser,
    required,
    adminRole
} = require('../lib/decorator')
const {
    getUserOne,
    getUserOneByName,
    addUser,
    checkPassword,
    updateUser,
    getUsers,
    getUserList
} = require('../service/user')
const address = require('address')
const {regEmail} = require('../utils/constant')
const {ExistHttpException, HttpException, Success} = require("../lib/httpException")
const {SendEmail} = require("../utils/email")
const bcrypt = require('bcrypt-nodejs')
const captchapng = require("captchapng")

@controller('/users')
class UserController {
    /**
     * 注册用户
     * @param {*} name
     * @param {*} email
     * @param {*} password
     */
    @post('/add')
    @required({
        body: ['name', 'password', 'email']
    })
    async addUser(req, res, next) {
        const {name, password, email} = req.body;
        const userExist = await getUserOneByName(name)
        const emailExist = await getUserOne({email})
        if (userExist) {
            return res.send(new ExistHttpException("用户名已经存在"))
        }
        if (!regEmail.test(email)) {
            return res.send(new HttpException('邮箱格式不对', 0, 0))
        }
        if (emailExist) {
            return res.send(new ExistHttpException("邮箱已经存在"))
        }
        const salt = bcrypt.genSaltSync(2);
        const pass = bcrypt.hashSync(password, salt);
        const saltcode = bcrypt.genSaltSync(2);
        const code = bcrypt.hashSync(name, saltcode);

        const user = await addUser({name, pass, email, isLive: false, errorNum: 0, disable: false, role: "user",code})
        if (user) {
            req.session.user = {
                _id: user._id,
                name: user.name,
                role: user.role,
                email: user.user
            };
            const subject = "账号注册";
            const text = "text";
            const html = `<p>感谢您的注册，请点击这里激活您的账号</p>
            <p><a href="http://${address.ip()}:3200/users/active?email=${email}&code=${code}">思迈特软件欢迎您</a></p>`;
            await SendEmail(email, subject, text, html);
            return res.send(new Success("注册成功，请移步到邮箱激活"))
        }
    }

    /**
     * @param {*} name
     * @param {*} email
     * @param {*} password
     * 登录
     */
    @post('/login')
    @required({
        body: ['name', 'password', "code"]
    })
    async login(req, res, next) {
        let {name, password, code} = req.body;
        if (req.session.code != code) {
            return res.send(new HttpException('验证码错误', 0, 0))
        }
        const user = await checkPassword({name}, password)
        if (!user.user) {
            return res.send(new HttpException('账号查找不到', 0, 0))
        }
        if (user.user.errorNum >= 3) {
            await updateUser(user.user.email, {disable: true})
            return res.send(new HttpException('账号已被禁用', 0, 0))
        }
        if (!user.user.isLive) {
            return res.send(new HttpException('账号未激活', 0, 0))
        }
        if (!user.match) {
            if (user.user.role == "admin") {
                return res.send(new HttpException(`密码错误`, 0, 0))
            }
            let userByEmail = await updateUser(user.user.email, {errorNum: ++user.user.errorNum})
            return res.send(new HttpException(`密码错误${user.user.errorNum}次`, 0, 0))
        }
        req.session.user = {
            _id: user.user._id,
            name: user.user.name,
            role: user.user.role
        }
        res.send({msg: "登陆成功", data: user.user, code: 201})
    }

    /**
     * @param {*} code
     * @param {*} email
     * 激活链接
     */
    @get('/active')
    async active(req, res, next) {
        let {code, email} = req.query;
        const userExist = await getUserOne({code})
        if (!userExist){
            return res.send(new HttpException("激活失败", 0, 0))
        }
        let user = await updateUser(email, {isLive: true})
        if (user) {
            return res.redirect(`http://${address.ip()}:8089`)
        }
    }

    /**
     * 获取图形验证码
     */
    @get('/code')
    async getCode(req, res, next) {
        let code = parseInt(Math.random() * 9000 + 1000);
        req.session.code = code;
        let p = new captchapng(80, 30, code); // width,height,numeric captcha
        p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
        p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
        let img = p.getBase64();
        let imgbase64 = new Buffer.from(img, 'base64');
        res.send(imgbase64)
    }

    /**
     * @param {*} pageSize
     * @param {*} page
     * 获取成员列表
     */
    @get('/users')
    @authUser
    @adminRole("admin")
    async userList(req, res) {
        let {pageSize = 10, page = 1, keyWord} = req.query
        let users = await getUsers({role: "user", name: {$regex: '.*' + keyWord + '.*'}})
        let userList = await getUserList({role: "user", name: {$regex: '.*' + keyWord + '.*'}}, pageSize, page)
        return res.send({
            code: 201, msg: '成功', data: {
                total: users.length,
                list: userList
            }
        })
    }

    /**
     * @param {*} email
     * @param {*} disable
     * 启用和停用
     */
    @post("/updateDisable")
    @authUser
    @adminRole("admin")
    async updateDisable(req, res) {
        let {email, disable} = req.body
        let errorNum = disable == "true" ? 3 : 0
        let user = await updateUser(email, {disable, errorNum})
        if (user) {
            return res.send({code: 201, msg: '成功', data: user})
        }
        return res.send({code: 405, msg: '失败', data: user})
    }

    @get("/checkLogin")
    @authUser
    async checkLogin(req, res) {
        return res.send(new Success())
    }

}

module.exports = {
    UserController
}