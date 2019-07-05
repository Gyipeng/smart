const express = require('express')
const router = express.Router()
const user = require('../db/model/userModel')
const Mail = require('../utils/mail')
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
router.post('/reg',(req,res)=>{
  let {name,pass,code} = req.body
  if(name&&pass&&code) {
    if(codes[name]!=code){
      return res.send({err:-4,msg:'验证码错误'})
    }
    user.find({name}).then(data=>{
      if(data.length===0){
        return user.insertMany({name,pass})
      } else {
        res.send({err:-5,msg:'用户名已存在'})
      }
    })
    .then(()=>{
      res.send({err:0,msg:'注册成功'})
    }).catch(err=>{
      res.send({err:-2,msg:'错误'})
    })
  } else {
    return res.send({err:-1,msg:'参数错误'})
  }
  console.log(name,pass)
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
router.post('/login',(req,res)=>{
  let {name,pass} = req.body
  if(!name||!pass){
    return res.send({err:-1,res:'参数错误'})
  }
  user.find({name,pass}).then(data=>{
    console.log(data)
    if(data.length>0){
      res.send({err:0,msg:'登陆成功'})
    } else {
      res.send({err:-2,msg:'账号或密码错误'})
    }
    // console.log(res)
  }).catch(err=>{
    res.send({err:-1,msg:'内部错误'})
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
router.post('/mailcode',(req,res)=>{
  console.log(req.body)
  let {mails} = req.body
  let code = parseInt(Math.random()*10000)
  if(!mails){
      res.send({err:0,msg:'邮箱错误'})
  } else {
      Mail.main(mails,code).then(()=>{
        //将邮箱和验证码保存到缓存中
        codes[mails] = code
        console.log(codes)
        res.send({err:0,msg:'ok'})
      }).catch(()=>{
        res.send({err:0,msg:'验证失败'})
      })
  }
})
module.exports = router