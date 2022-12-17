const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    async SendEmailSalesRegistrationByCustomer(data) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            // debug: true,
            // logger: true,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_APP_NAME, // generated ethereal user
                pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'UNOMO Thương Mại Điện Tử', // sender address
            to: data.email, // list of receivers
            subject: `Xác Nhận Email Để Đăng Ký Bán Hàng ❤️😁`, // Subject line
            html: this.getLanguageBodyHTML(data.email, data.OTP), // html body
        });
    }

    getLanguageBodyHTML(email, OTP) {
        return `

            <h1 class="text-center">UNOMO Xin Kính Chào Quý Khách Hàng</h1>
            <p class="text-center">Cảm ơn bạn đã quan tâm đến dịch vụ bán hàng ở website của chúng tôi</p>
            <span>Có phải email của bạn là : ${email} ?</span>

                <p>Đưới đây là mã OTP của bạn : <strong>${OTP}</strong></p>
            </p>
        
        `;
    }

    async SendEmailToCustomer(data) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            // debug: true,
            // logger: true,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_APP_NAME, // generated ethereal user
                pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'UNOMO Thương Mại Điện Tử', // sender address
            to: data.email, // list of receivers
            subject: `Shop ${data.user.firstName} ${data.user.lastName} xin gửi thư đến bạn ❤️😁`, // Subject line
            html: data.contentHtml, // html body
        });
    }
}

module.exports = new EmailService();
