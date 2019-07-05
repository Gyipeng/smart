const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db/contnect')
const app = express()
const path = require('path')
// app.use 使用中间件 x-www-form-urlencoded 表单
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// 静态目录指向
app.use('/public',express.static(path.join(__dirname,'./static')))
// 路由
let userRouter = require('./router/userRouter')
let foodRouter = require('./router/foodRouter')
app.use('/food',foodRouter)
app.use('/users',userRouter)
app.listen(3000,()=>{
    console.log('ok')
})