import { z } from "zod";
import { verifyCodeValidation } from "./verifySchema";
import { passwordValidation } from "./signUpSchema";

export const verifyForgotPasswordSchema = z.object({
  password: passwordValidation,
  verifyCode: verifyCodeValidation,
});
