const nodemailer = require("nodemailer");

const sendEmail = async(email, confirmationCode) => {
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
            subject: "E-vote: Please confirm your account",
            html:   `<h1>Email confirmation</h1>
                    <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
                    <a href=http://localhost:5000/user/verify/${confirmationCode}> Click here</a>`
        })

        console.log("Message Sent: %s", info.messageId);
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendEmail;