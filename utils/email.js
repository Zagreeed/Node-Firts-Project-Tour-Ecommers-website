const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // first we need to creat a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //second define the email options
  const emailOptions = {
    from: 'Danley Galan <hellow@danley.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //third actaully send the email
  await transporter.sendMail(emailOptions);
  console.log(await transporter.sendMail(emailOptions));
};

module.exports = sendEmail;
