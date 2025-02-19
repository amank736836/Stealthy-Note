import { z } from "zod";
import { verifyCodeValidation } from "./verifySchema";
import { passwordValidation } from "./signUpSchema";
import { identifierValidation } from "./signInSchema";

export const verifyForgotPasswordSchema = z.object({
  identifier: identifierValidation,
  password: passwordValidation,
  confirmPassword: passwordValidation,
  verifyCode: verifyCodeValidation,
});
