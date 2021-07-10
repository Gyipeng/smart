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
     <p><a href="http://localhost:3200/users/checkCode?email=${email}&code=${code}">思迈特软件欢迎您</a></p>
     <p>祝您使用愉快，使用过程中您有任何问题请及时联系我们。</p>
     <p>温馨提示：不要泄漏给其他人，如果无法点击，请复制地址粘贴到浏览器地址栏中按回车。</p>`
    };
    send(mail)
};