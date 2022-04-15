require('dotenv').config()
const nodeMailer = require('nodemailer')

const adminEmail = process.env.GMAIL
const adminPassword = process.env.GMAIL_PASSWORD
const mailHost = 'smtp.gmail.com'
const mailPort = 587

const sendMail = (to, subject, content) => {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  });

  const options = {
    from: adminEmail, // địa chỉ admin email bạn dùng để gửi
    to: to, // địa chỉ gửi đến
    subject: subject, // Tiêu đề của mail
    text: content
  }

  // console.log(`Mail: ${adminEmail}, Password: ${adminPassword}`)

  // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
  return transporter.sendMail(options)
}

module.exports = {
  sendMail: sendMail
}
