const nodemailer = require('nodemailer');

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Password Reset OTP</title>
      </head>
      <body style="margin:0; padding:0; font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4;">
        <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto;">
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 12px rgba(0,0,0,0.1);">
              <h2 style="color: #333333; text-align: center;">🔐 Password Reset Request</h2>
              <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                Hello,<br><br>
                We received a request to reset your password. Use the following One-Time Password (OTP) to proceed:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; padding: 16px 32px; font-size: 24px; font-weight: bold; background-color: #4CAF50; color: white; border-radius: 6px; letter-spacing: 2px;">
                  ${otp}
                </span>
              </div>
              <p style="color: #555555; font-size: 14px; text-align: center;">
                This OTP is valid for the next <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email.
              </p>
              <p style="color: #999999; font-size: 12px; text-align: center; margin-top: 40px;">
                &copy; 2025 Your Company. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendOTPEmail };