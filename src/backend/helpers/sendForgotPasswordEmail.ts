import { ApiResponse } from "@/types/ApiResponse";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.Node_Mailer_Email,
    pass: process.env.Node_Mailer_Password,
  },
});

export async function sendForgotPasswordEmail({
  email,
  username,
  verifyCode,
  baseUrl,
}: {
  email: string;
  username: string;
  verifyCode: string;
  baseUrl: string;
}): Promise<ApiResponse> {
  const Mail = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forgot Your Password</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f8f9fa;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .email-container {
                max-width: 600px;
                background: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
                border: 1px solid #ddd;
            }
            .header {
                font-size: 24px;
                font-weight: bold;
                color: #dc3545;
                margin-bottom: 10px;
            }
            .content {
                font-size: 16px;
                color: #333;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            .reset-button {
                display: inline-block;
                background-color: #dc3545;
                color: #ffffff;
                padding: 12px 25px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: bold;
                margin-top: 10px;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">Forgot Your Password</div>
            <div class="content">
                <p>Hello, ${username}</p>
                <p>We received a request to Forgot your password. Click the button below to Forgot your password:</p>
                <a href="${baseUrl}/verify-forgot-password/${email}/${verifyCode}" class="reset-button">Forgot Password</a>
                <p>If you did not request a password reset, please ignore this email.</p>
            </div>
            <div class="footer">&copy; ${new Date().getFullYear()} Stealthy Note. All rights reserved.</div>
        </div>
    </body>
    </html>
    `;

  try {
    const mailOptions = {
      from: `Stealthy Note<${process.env.Node_Mailer_Email}>`,
      to: email,
      subject: `Stealthy Note - Reset Your Password for ${username}`,
      text: `Verification code: ${verifyCode}`,
      html: Mail,
    };

    const response = await transporter.sendMail(mailOptions);

    console.log("Forgot password code - Email sent successfully", response);

    if (response.rejected.length > 0) {
      console.error(
        "Failed to send forgot password code - Email",
        response.rejected
      );
      return {
        success: false,
        message: "Failed to send forgot password code - Email",
      };
    }

    return Promise.resolve({
      success: true,
      message: "Forgot password code - Email sent successfully",
    });
  } catch (error) {
    console.error("Failed to send forgot password code - Email", error);
    return {
      success: false,
      message: "Failed to send forgot password code - Email",
    };
  }
}
