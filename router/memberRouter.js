const express = require('express')
const router = express.Router()
const user = require('../db/model/userModel')


router.post('/getMemberList', (req, res) => {

    let token = req.session.token
    let {pageSize = 10, page = 1} = req.body

    user.find({email: token}).then(data => {
        if (data[0].name == "admin") {
            user.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize)).then(list => {
                res.send({err: 0, msg: '查询成功', list})
            })
        }
    }).catch(() => {
        res.send({err: -1, msg: '查询失败'})
    })
})

router.post('/updateDisable', (req, res) => {
    let {email, disable} = req.body
    user.updateOne({email}, {disable, errorNum: disable ? 3 : 0}).then(data => {
        res.send({err: 0, msg: '成功', data})
    }).catch(() => {
        res.send({err: -1, msg: '失败'})
    })
})


module.exports = router