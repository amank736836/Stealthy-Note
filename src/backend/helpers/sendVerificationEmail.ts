import { resend } from "@/backend/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../emails/VerificationEmail";
VerificationEmail;

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { error } = await resend.emails.send({
      from: "StealthNote@resend.dev",
      to: "stealthnote@outlook.com",
      subject: `Stealth Node - Verification Code for ${email}`,
      react: VerificationEmail({ username, verifyCode }),
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
