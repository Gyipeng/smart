// 引入 nodemailer
var nodemailer = require('nodemailer');

// 创建一个SMTP客户端配置
var config = {
    host: 'smtp.qq.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: '826256407@qq.com', //刚才注册的邮箱账号
        pass: 'mrjvsewfkuhrbdjh'  //邮箱的授权码，不是注册时的密码
    }
};

// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);

// 发送邮件
module.exports = function (mail){
    return new Promise((resolve, reject) => {
    transporter.sendMail(mail, function(error, info){
        if(error) {
            reject('验证失败')
            return console.log(error);
        }
        resolve()
        console.log('mail sent:', info.response);
    })});
};