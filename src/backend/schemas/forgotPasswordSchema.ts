import { z } from "zod";
import { identifierValidation } from "@/backend/schemas/signInSchema";

export const forgotPasswordSchema = z.object({
  identifier: identifierValidation,
});
