import { z } from "zod";
import { identifierValidation } from "./signInSchema";
import { verifyCodeValidation } from "./verifySchema";

export const userVerifySchema = z.object({
  identifier: identifierValidation,
  verifyCode: verifyCodeValidation,
});
