var send = require('./email');


// 创建一个邮件对象
module.exports = function(email,code){
    mail = {
        // 发件人
        from: '826256407@qq.com',
        // 主题
        subject: '激活账号',
        // 收件人
        to: email,
        // 邮件内容，HTML格式
        text: '您好！', //接收激活请求的链接
        html: `<p>感谢您的注册，请点击这里激活您的账号</p>
     <p><a href="./users/active?email=${email}&code=${code}">思迈特软件欢迎您</a></p>`
    };
    send(mail)
};