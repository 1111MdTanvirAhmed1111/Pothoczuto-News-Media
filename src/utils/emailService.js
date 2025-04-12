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
    subject: '🔐 Your Pothoczuto Password Reset OTP',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Pothoczuto OTP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          @keyframes bounce {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .otp-box:hover {
            background-color: #0056c7 !important;
          }
          .otp-box:active {
            transform: scale(0.98);
          }
          .copy-text {
            font-size: 12px;
            color: #777;
            text-align: center;
            margin-top: 10px;
            font-style: italic;
            animation: bounce 1.5s infinite;
          }
        </style>
      </head>
      <body style="margin:0; padding:0; background-color: #f9fafb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 40px 15px;">
              <table style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); overflow: hidden;">
                <tr>
                  <td style="background-color: #20242f; padding: 20px 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px; color: #ffffff;">📰 Pothoczuto</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="color: #333333; margin-top: 0;">Reset Your Password</h2>
                    <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                      Hey there 👋,<br /><br />
                      We've received a request to reset your Pothoczuto password. Here's your magic OTP:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                      <div class="otp-box" style="
                        display: inline-block;
                        padding: 18px 40px;
                        font-size: 28px;
                        font-weight: bold;
                        color: #ffffff;
                        background-color: #007BFF;
                        border-radius: 10px;
                        letter-spacing: 3px;
                        transition: background-color 0.3s ease;
                        animation: bounce 2s infinite;
                      ">
                        ${otp}
                      </div>
                      <p class="copy-text">📋 Tap & hold to copy OTP</p>
                    </div>
                    <p style="color: #666666; font-size: 14px; text-align: center;">
                      This OTP is valid for <strong>10 minutes</strong>. If you didn’t ask for a password reset, feel free to ignore this.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f1f1f1; padding: 20px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #888888;">
                      &copy; ${new Date().getFullYear()} Pothoczuto News Media. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
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