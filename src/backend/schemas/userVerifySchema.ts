import { z } from "zod";
import { identifierValidation } from "@/backend/schemas/signInSchema";

export const verifyCodeValidation = z
  .number()
  .min(100000, { message: "Verify code must be 6 digits long" })
  .max(999999, { message: "Verify code must be 6 digits long" });

export const userVerifySchema = z.object({
  identifier: identifierValidation,
  verifyCode: verifyCodeValidation,
});
