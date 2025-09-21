const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const mailSender =  async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER, // generated ethereal user
                pass: process.env.EMAIL_PASSWORD, // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: '"StudyNotion" || Course Platform " < ,process.env.EMAIL_USER>', // sender address
            to: `${email}`,
            subject: title,
            html: `${body}`,
        });

        console.log(info);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
module.exports = mailSender;