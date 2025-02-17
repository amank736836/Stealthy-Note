import { z } from "zod";
import { identifierValidation } from "./signInSchema";

export const forgotPasswordSchema = z.object({
  identifier: identifierValidation,
});
