import { resend } from "@/backend/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import nodemailer from "nodemailer";
import VerificationEmail from "../emails/VerificationEmail";

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

console.log("Transporter created", transporter);

export async function sendVerificationEmail(
  baseUrl: string,
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  const Mail = `<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verification Code</title>
  <style>
    @font-face {
      font-family: "Roboto";
      src: url("https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2")
        format("woff2");
      font-weight: 400;
      font-style: normal;
    }
    body {
      font-family: "Roboto", sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .container {
      max-width: 600px;
      margin: 20px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      background-color: #ffffff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    h2 {
      color: #333;
      text-align: center;
    }
    p {
      color: #555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      color: #ffffff;
      background-color: #007bff;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      margin-top: 20px;
      display: block;
      width: fit-content;
      margin-left: auto;
      margin-right: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hello ${username},</h2>
    <p>
      Thank you for signing up with us. You are just one step away from
      completing your registration.
    </p>
    <p>
      Please use the following verification code to complete your
      registration:
    </p>
    <p><strong>Verification code: ${verifyCode}</strong></p>
    <a href="${baseUrl}/verify/${username}/${verifyCode}" class="button"
      >Click here to verify</a
    >
  </div>
</body>
</html>`;

  try {
    let mailOptions = {
      from: `Stealthy Note<${process.env.Node_Mailer_Email}>`,
      to: email,
      subject: `Stealthy Note - Verification Code for ${email}`,
      text: `Verification code: ${verifyCode}`,
      html: Mail,
      react: VerificationEmail({
        baseUrl,
        username,
        verifyCode,
      }),
    };

    const response = await transporter.sendMail(mailOptions);

    console.log("Email sent", response);

    const { error } = await resend.emails.send({
      from: "StealthyNote@resend.dev",
      to: "stealthnote@outlook.com",
      subject: `Stealthy Note - Verification Code for ${email}`,
      html: Mail,
      react: VerificationEmail({
        baseUrl,
        username,
        verifyCode,
      }),
    });

    if (error) {
      console.error("Failed to send verification email", error);
      return {
        success: false,
        message: "Failed to send verification email",
      };
    }

    return Promise.resolve({
      success: true,
      message: "Verification email send successfully",
    });
  } catch (error) {
    console.error("Failed to send verification email", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
