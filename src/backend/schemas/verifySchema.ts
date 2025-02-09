import { z } from "zod";

export const verifyCodeValidation = z
  .string()
  .length(6, { message: "Verify code must be 6 characters long" });

export const verifySchema = z.object({
  verifyCode: verifyCodeValidation,
});
