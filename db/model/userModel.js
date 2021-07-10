const mongoose = require('mongoose')
var userSchema = mongoose.Schema({
    name: {type: String,required: true},
    email:{type: String,required: true},
    pass: {type: String,required: true},
    islive:Boolean,
    errorNum:Number,
    disable:Boolean
  });
  // 将schema对象转化为数据模型
var user = mongoose.model('user', userSchema); // 将数据对象和集合关联('集合名',scheam对象)
module.exports=user