const mongoose = require('mongoose')
var foodSchema = mongoose.Schema({
    name: {type: String,required: true},
    price: {type: String,required: true},
    desc: {type: String,required:true},
    typename: {type: String,required:true},
    typeid: {type: Number,required:true},
    img: {type: String,required:true}
  });
  // 将schema对象转化为数据模型
var food = mongoose.model('food', foodSchema); // 将数据对象和集合关联('集合名',scheam对象)
module.exports=food