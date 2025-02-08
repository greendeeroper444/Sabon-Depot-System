const nodemailer = require('nodemailer');
require('dotenv').config();


const SendOtpEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            rateLimit: 10,
        });

        const mailOptions = {
            from: `'Sabon Depot' <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your OTP Code',
            text: `${otp} is your Sabon Depot code.`,
            html: `
                <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; background-color: #f4f4f4;">
                    <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%;">
                        <h2 style="text-align: center;">Sabon Depot Logo</h2>
                        <h2 style="color: #4CAF50; text-align: center;">OTP Verification</h2>
                        <p style="font-size: 16px; line-height: 1.5; color: #333;">Dear Customer,</p>
                        <p style="font-size: 16px; line-height: 1.5; color: #333;">Your OTP code is:</p>
                        <h3 style="font-size: 24px; color: #4CAF50; text-align: center; font-weight: bold;">${otp}</h3>
                        <p style="font-size: 16px; line-height: 1.5; color: #333;">Please use this code to complete your registration. The code is valid for 5 minutes.</p>
                        <p style="font-size: 16px; line-height: 1.5; color: #333;">Thank you for choosing Sabon Depot!</p>
                        <div style="text-align: center; margin-top: 30px;">
                            <p style="font-size: 14px; color: #888;">If you did not request this, please ignore this email.</p>
                        </div>
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Could not send OTP email');
    }
};

module.exports = SendOtpEmail




// const sgMail = require('@sendgrid/mail');
// require('dotenv').config();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const SendOtpEmail = async (email, otp) => {
//     const msg = {
//         to: email,
//         from: process.env.EMAIL_USER, // Use the email address or domain you verified with SendGrid
//         subject: 'Your OTP Code',
//         text: `${otp} is your Sabon Depot code.`,
//     };

//     try {
//         await sgMail.send(msg);
//         console.log('Email sent');
//     } catch (error) {
//         console.error('Error sending email: ', error);
//     }
// };

// module.exports = SendOtpEmail;
