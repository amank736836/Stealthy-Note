import { resend } from "@/backend/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    const { error } = await resend.emails.send({
      from: "StealthyNote@resend.dev",
      to: "stealthnote@outlook.com",
      subject: `Stealthy Note - Verification Code for ${email}`,
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
