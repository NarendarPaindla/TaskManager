const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: `"Task Manager" <noreply@taskmanager.com>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
