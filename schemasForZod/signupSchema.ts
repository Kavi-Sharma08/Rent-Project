import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .coerce
    .string()
    .min(2, "Name at least 2 characters")
    .max(20, "Name should be less than 20 characters"),

  email: z
    .string()
    .email({ message: "Invalid email format" }),

  password: z
    .coerce
    .string()
    .min(8, { message: "Password must be greater than 8 characters" })
    .max(50, { message: "Password should be less than 50 characters" }),
});

