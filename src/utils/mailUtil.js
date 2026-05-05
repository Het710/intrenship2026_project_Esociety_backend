require('dns').setDefaultResultOrder('ipv4first');
const mailer = require('nodemailer');

const sendMail = async (to, subject, visitorData) => {
    try {
        const transporter = mailer.createTransport({
            host: 'smtp.gmail.com',
            port: 2525, 
            secure: false, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 10000,
            family: 4 
        });

        const isVisitor = visitorData && typeof visitorData === 'object';
        const mailOptions = {
            from: `"E-Society" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: isVisitor ? `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #3b82f6;">New Visitor Notification</h2>
                    <p><strong>Name:</strong> ${visitorData.name}</p>
                    <p><strong>Type:</strong> ${visitorData.type}</p>
                    <a href="${process.env.FRONTEND_URL}/user/visitors" style="background:#3b82f6; color:white; padding:10px; text-decoration:none;">Manage</a>
                </div>` 
                : `<div style="font-family: sans-serif; padding: 20px;">
                    <h2>${subject}</h2>
                    <p>${visitorData}</p> 
                   </div>`
        };

        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Nodemailer Internal Error:", error.message);
    }
}

module.exports = sendMail;