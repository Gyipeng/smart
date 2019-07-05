const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db/contnect')
const app = express()
// const Mail = require('./utils/mail')
// app.use 使用中间件 x-www-form-urlencoded 表单
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// 发送邮箱验证码
// console.log(Mail)
// app.post('/mailcode',(req,res)=>{
//     console.log(req.body)
//     let {mails} = req.body
//     let code = parseInt(Math.random()*10000)
//     if(!mails){
//         res.send({err:0,msg:'邮箱错误'})
//     } else {
//         Mail.main(mails,code).then(()=>{
//           res.send({err:0,msg:'ok'})
//         }).catch(()=>{
//           res.send({err:0,msg:'验证失败'})
//         })
//     }
// })
// 路由
let userRouter = require('./router/userRouters')
app.use('/users',userRouter)
app.listen(3000,()=>{
    console.log('ok')
})