const express = require('express')
const router = express.Router()
const user = require('../db/model/userModel')
const send = require("../utils/send")
const mail = require('../utils/mail')
let codes = {}

// 注册
/**
 * @api {post} /users/reg  用户注册
 * @apiName 用户注册
 * @apiGroup reg
 *
 * @apiParam {String} name 用户名
 * @apiParam {String} pass 密码
 * @apiParam {String} code 验证码
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/reg', (req, res) => {
    let {name, pass,email, code} = req.body
    if (name && pass&&email) {
        user.find({email}).then(data => {
            if (data.length === 0) {
                user.insertMany({email,name, pass, islive: false, errorNum: 0,disable:false}).then((doc) => {
                    send(email, doc[0]._id)
                })
            } else {
                res.send({err: -5, msg: '用户名已存在'})
            }
        })
            .then(() => {
                res.send({err: 0, msg: '注册成功,请移步到邮箱激活'})
            }).catch(err => {
            res.send({err: -2, msg: '错误'})
        })
    } else {
        return res.send({err: -1, msg: '参数错误'})
    }

    // console.log(res)
})
// 登陆
/**
 * @api {post} /users/login  用户登陆
 * @apiName 用户注册
 * @apiGroup login
 *
 * @apiParam {String} name 用户名
 * @apiParam {String} pass 密码
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/login', (req, res) => {
    let {pass,email, code} = req.body
    if (!pass||!code||!email) {
        return res.send({err: -1, msg: '参数错误'})
    }
    if(codes[email]!=code){
      return res.send({err:-4,msg:'验证码错误'})
    }
    user.find({email}).then(data => {
        if (data[0].errorNum >= 3) {
            user.updateOne({email}, {disable: true}, (err, doc)=>  {
            });
            res.send({err: -3, msg: '账号已经被禁用，请通知管理员来激活'})
        }
        if (!data[0].islive){
            res.send({err: -5, msg: '账号未在邮箱中激活，请移步到邮箱'})
        }
        if (data[0].pass == pass) {
            req.session.token = email; // 登录成功，设置 session
            user.updateOne({email}, {errorNum: 0,disable:false},  (err, doc)=> {
            });
            res.send({err: 0, msg: '登陆成功',name:data[0].name})
        } else {
            user.updateOne({email}, {errorNum: ++data[0].errorNum}, (err, doc)=>  {
            });
            res.send({err: -2, msg: '账号或密码错误'})
        }
    }).catch(err => {
        res.send({err: -1, msg: '内部错误'})
    })
})
// 邮箱验证码接口
/**
 * @api {post} /users/mailcode  邮箱验证码接口
 * @apiName 用户注册
 * @apiGroup mailcode
 *
 * @apiParam {String} mails 邮箱
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/mailcode', (req, res) => {
    let {email} = req.body
    let code = parseInt(Math.random() * 10000)
    if (!email) {
        res.send({err: 0, msg: '邮箱错误'})
    } else {
        mail(email, code).then(() => {
            //将邮箱和验证码保存到缓存中
            codes[email] = code
            res.send({err: 0, msg: '发送成功'})
        }).catch(() => {
            res.send({err: 0, msg: '验证失败'})
        })
    }
})

/* 验证用户,激活链接 */
router.get('/checkCode', function (req, res, next) {
    let {email, code} = req.query
    user.findOne({email}, function (err, users) {
        if (users._id == code) {
            user.updateOne({email}, {islive: true}, function (err, doc) {
                if (err) {
                    res.json({
                        status: '1',
                        msg: '激活失败',
                        result: ''
                    })
                } else {
                    res.redirect("http://localhost:8089/")

                }
            });
        }
    });
});




module.exports = router