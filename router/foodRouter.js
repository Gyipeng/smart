const express = require('express')
const router = express.Router()
const foodModel = require('../db/model/foodModel')
/**
 * @api {post} /food/add  添加
 * @apiName 添加
 * @apiGroup add
 * @apiParam {String} name 邮箱
 * @apiParam {String} price 价钱
 * @apiParam {String} desc 降序
 * @apiParam {String} typename 类型名
 * @apiParam {String} typeid id
 * @apiParam {String} img 图片
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/add',(req,res)=>{
    let {name,price,desc,typename,typeid,img} = req.body
    foodModel.insertMany({name,price,desc,typename,typeid,img}).then(data=>{
      res.send({err:0,msg:'添加成功'})
    }).catch(err=>{
      res.send({err:-1,msg:'添加失败'})
    })
})
// 分类查询接口
/**
 * @api {post} /food/getInfoByType  分类查询接口
 * @apiName 分类查询接口
 * @apiGroup getInfoByType
 * @apiParam {String} typeid id
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoByType',(req,res)=>{
  let {typeid} = req.body
  foodModel.find({typeid}).then(data=>{
    res.send({err:0,msg:'查询成功',data})
  }).catch(()=>{
    res.send({err:-1,msg:'查询失败'})
  })
})
// 模糊查询接口
/**
 * @api {post} /food/getInfoByKw  模糊查询接口
 * @apiName 模糊查询接口
 * @apiGroup getInfoByKw
 * @apiParam {String} kw 模糊查询name和desc
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoByKw',(req,res)=>{
    let {kw} = req.body
    let reg = RegExp(kw) // 创建一个正则表达式 匹配关键字
    //  foodModel.find({name:{$regex:reg}}) // 模糊查询
    foodModel.find({$or:[{name:{$regex:reg}},{desc:{$regex:reg}}]}).then(data=>{
      res.send({err:0,msg:'查询成功',data})
    }).catch(()=>{
      res.send({err:-1,msg:'查询失败'})
    })
})
// 删除接口.
/**
 * @api {post} /food/del  删除接口
 * @apiName 模糊查询接口
 * @apiGroup del
 * @apiParam {String} _id _id
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/del',(req,res)=>{
    let {_id} = req.body
    let id = _id.split(',')
    // foodModel.remove({_id}) // 单个删除
    foodModel.remove({_id: {$in:id}}).then(data=>{
      res.send({err:0,msg:'删除成功'})
    }).catch(()=>{
      res.send({err:-1,msg:'删除失败'})
    })
})
// 修改接口
/**
 * @api {post} /food/update  修改接口
 * @apiName 修改接口
 * @apiGroup update
 * @apiParam {String} _id 要修改的_id
 * @apiParam {String} name 邮箱
 * @apiParam {String} price 价钱
 * @apiParam {String} desc 降序
 * @apiParam {String} typename 类型名
 * @apiParam {String} typeid 分类id
 * @apiParam {String} img 图片
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/update',(req,res)=>{
    let {name,price,desc,typename,typeid,img,_id} = req.body
    foodModel.updateOne({_id},{name,price,desc,typename,typeid,img}).then(data=>{
      res.send({err:0,msg:'修改成功'})
    }).catch(()=>{
      res.send({err:-1,msg:'修改失败'})
    })
})
// 分页接口 
/**
 * @api {post} /food/getInfoByPage  分页接口
 * @apiName 分页接口
 * @apiGroup getInfoByPage
 * @apiParam {String} pageSize 每页多少条
 * @apiParam {String} page 页
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoByPage',(req,res)=>{
  let pageSize = req.body.pageSize || 5
  let page = req.body.page || 1
  foodModel.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize)).then(data=>{
    res.send({err:0,msg:'查询成功',data})
  }).catch(()=>{
    res.send({err:-1,msg:'查询失败'})
  })
})
module.exports = router