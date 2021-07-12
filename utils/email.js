const {emailConfig} = require('../utils/constant')
// 引入 nodemailer
var nodemailer = require('nodemailer');

// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(emailConfig);

const SendEmail = async (email, subject, text, html) => {
    return await transporter.sendMail({
        from: emailConfig.auth.user, // 发送者邮箱地址
        to: email,                   // 接收这邮箱地址
        subject,                     // 邮件主题
        html,                        // html模板
        text                         // 文本内容
    })
}

// 发送邮件
module.exports = {
    SendEmail
}