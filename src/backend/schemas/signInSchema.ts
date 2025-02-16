import { z } from "zod";
import { passwordValidation } from "./signUpSchema";

export const identifierValidation = z
  .string()
  .min(2, { message: "Identifier must be at least 2 characters long" })
  .max(50, { message: "Identifier must be at most 50 characters long" })
  .toLowerCase();

export const signInSchema = z.object({
  identifier: identifierValidation,
  password: passwordValidation,
});
