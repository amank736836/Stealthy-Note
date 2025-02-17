import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, { message: "Username must be at least 2 characters long" })
  .max(20, { message: "Username must be at most 20 characters long" })
  .regex(/^[a-zA-Z0-9_]*$/, {
    message: "Username must contain only letters, numbers, and underscores",
  })
  .toLowerCase();

export const emailValidation = z
  .string()
  .email({ message: "Invalid email format" })
  .min(5, { message: "Email must be at least 5 characters long" })
  .max(50, { message: "Email must be at most 50 characters long" })
  .toLowerCase();

export const passwordValidation = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(20, { message: "Password must be at most 20 characters long" })
  .regex(/^[a-zA-Z0-9@#$&]*$/, {
    message:
      "Password must contain only letters, numbers, and the following special characters: @, #, $, &",
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});
