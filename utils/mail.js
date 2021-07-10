
var send = require('./email');

// 创建一个邮件对象
module.exports = function(email,code){
    mail = {
        // 发件人
        from: '826256407@qq.com',
        // 主题
        subject: '发送验证码',
        // 收件人
        to: email,
        // 邮件内容，HTML格式
        text: `你的验证码是${code}`, // plain text body
    };
   return send(mail)
};
