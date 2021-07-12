const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
var userSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    email: {type: String, required: true, index: true},
    pass: {type: String, required: true},
    isLive: Boolean,
    errorNum: Number,
    disable: Boolean,
    code: String,
    createdAt:Date,
    role:String
});

// 模型的实例方法
userSchema.methods = {
    // 比对密码
    comparePassword: function (_password, password) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password, function (err, isMatch) {
                if (!err) resolve(isMatch)
                else reject(err)
            })
        })
    },
}


// 将schema对象转化为数据模型
var user = mongoose.model('user', userSchema); // 将数据对象和集合关联('集合名',scheam对象)
module.exports = user