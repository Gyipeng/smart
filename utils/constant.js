const regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ //验证邮箱正则
const  emailConfig = {
    host: 'smtp.qq.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: '826256407@qq.com', //刚才注册的邮箱账号
        pass: 'mrjvsewfkuhrbdjh'  //邮箱的授权码，不是注册时的密码
    }
};


module.exports={
    regEmail,
    emailConfig
}