import { z } from "zod";
import { identifierValidation } from "./signInSchema";

export const verifyCodeValidation = z
  .string()
  .length(6, { message: "Verify code must be 6 characters long" });

export const userVerifySchema = z.object({
  identifier: identifierValidation,
  verifyCode: verifyCodeValidation,
});
