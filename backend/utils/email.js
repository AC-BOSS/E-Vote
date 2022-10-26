const nodemailer = require("nodemailer");

const sendEmail = async(email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        })

        const info = await transporter.sendMail({
            from: "amartya.c26@gmail.com",
            to: email,
            subject: subject,
            text: text
        })

        console.log("Message Sent: %s", info.messageId);
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendEmail;