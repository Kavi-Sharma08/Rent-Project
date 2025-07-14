import * as z from "zod"
export const signinSchema = z.object({
    email: z
    .string()
    .email({ message: "Invalid email format" }),

  password: z
    .coerce
    .string()
    .min(8, { message: "Password must be greater than 8 characters" })
    .max(50, { message: "Password should be less than 50 characters" }),
});
