const nodemailer = require('nodemailer');
require('dotenv').config(); // Tải biến môi trường

// Hàm gửi email
const sendEmail = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER_CLIENT,
            pass: process.env.PASS_USER_CLIENT, // Mật khẩu ứng dụng
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_USER_CLIENT,
        to: to,
        subject: subject,
        text: text,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};


module.exports = { sendEmail };