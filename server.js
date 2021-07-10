const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db/contnect')
const app = express()
const path = require('path')
const parseurl = require('parseurl')
const session = require('express-session')
// app.use 使用中间件 x-www-form-urlencoded 表单
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//设置session配置
app.use(session({
    resave: false,  //重新保存
    saveUninitialized: true, //
    secret: 'keyboard cat',//通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改。
    cookie:{ maxAge: 1000*60*60*24}//失效时间
}));

app.use(function (req, res, next) {
    let pathname = parseurl(req).pathname;
    let whiteList=["mailcode","reg","checkCode"];//接口白名单
        let token = req.session.token;
        //判断是否登录入
        if(!token){
            if (/member/g.test(pathname)){
                res.send({err: -6, msg: '未登录请重新登陆'})
                res.redirect('/login')
            }else {
                next()
            }
        }else if(token){
            //已登录
            next();
        };
    }
)

// 静态目录指向
app.use('/public',express.static(path.join(__dirname,'./static')))

// 路由
let userRouter = require('./router/userRouter')

let memberRouter = require('./router/memberRouter')

app.use('/users',userRouter)
app.use('/member',memberRouter)




app.listen(3200,()=>{
    console.log('ok')
})