import {z} from "zod"

export const updateProfileSchema = z.object({
    college : z.string,
    location : z.string,
    phoneNumber : z
            .string()
            .length(10, { message: "Phone number must be exactly 10 digits" })
            .regex(/^[6-9]\d{9}$/, {message: "Enter a valid 10-digit Indian phone number",})


})

