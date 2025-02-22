import { z } from "zod";
import { passwordValidation } from "@/backend/schemas/signUpSchema";
import { identifierValidation } from "@/backend/schemas/signInSchema";
import { verifyCodeValidation } from "@/backend/schemas/userVerifySchema";

export const verifyForgotPasswordSchema = z.object({
  identifier: identifierValidation,
  password: passwordValidation,
  confirmPassword: passwordValidation,
  verifyCode: verifyCodeValidation,
});
