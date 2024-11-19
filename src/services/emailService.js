// services/emailService.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Test" <test@example.com>',
    to,
    subject,
    text,
  });

  console.log('E-posta gönderildi:', nodemailer.getTestMessageUrl(info));
};

module.exports = { sendEmail };
