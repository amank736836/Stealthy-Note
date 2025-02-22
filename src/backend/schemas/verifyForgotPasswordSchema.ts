import { z } from "zod";
import { passwordValidation } from "./signUpSchema";
import { identifierValidation } from "./signInSchema";
import { verifyCodeValidation } from "./userVerifySchema";

export const verifyForgotPasswordSchema = z.object({
  identifier: identifierValidation,
  password: passwordValidation,
  confirmPassword: passwordValidation,
  verifyCode: verifyCodeValidation,
});
