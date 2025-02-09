import { z } from "zod";

export const contentValidation = z
  .string()
  .min(10, { message: "Message must be at least 10 characters long" })
  .max(300, { message: "Message must be at most 300 characters long" });

export const messageSchema = z.object({
  content: contentValidation,
});
