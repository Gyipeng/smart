const bodyParser = require('body-parser')
const session = require('express-session')
const parseurl = require('parseurl')



exports.addBodyParser = app => {
    // app.use 使用中间件 x-www-form-urlencoded 表单
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
}


exports.addSession = app => {
    const CONFIG = {
        resave: false,  //重新保存
        saveUninitialized: true, //
        secret: 'keyboard cat',//通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改。
        cookie: {maxAge: 1000 * 60 * 60 * 24}//失效时间
    }
   //设置session配置
    app.use(session(CONFIG));

}