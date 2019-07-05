"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(mail,code){

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: '1635942033@qq.com', // 放送方邮箱地址 generated ethereal user
      pass: 'pvlpvsvisnloeabi' // SMTP验证码 generated ethereal password
    }
  });

  // send mail with defined transport object
  // let info = await transporter.sendMail({
  //   from: '"Fred Foo 👻" <1635942033@qq.com>', // sender address
  //   to: mail, // list of receivers
  //   subject: "Hello ✔", // Subject line
  //   text: `你的验证码是${code}`, // plain text body
  //   // html: `<b>Hello world?</b>` // html body
  // });
  return new Promise((resolve,reject)=>{
    transporter.sendMail({
      from: '"Fred Foo 👻" <1635942033@qq.com>', // sender address
      to: mail, // list of receivers
      subject: "Hello ✔", // Subject line
      text: `你的验证码是${code}`, // plain text body
      // html: `<b>Hello world?</b>` // html body
    },(err,data)=>{
      if(err){
        reject('验证失败')
      } else {
        resolve()
      }
    })
  })
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
// main('1635942033@qq.com',123)
module.exports={main}