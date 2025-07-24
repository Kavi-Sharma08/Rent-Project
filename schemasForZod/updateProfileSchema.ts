import {z} from "zod"

export const updateProfileSchema = z.object({
    college : z.string().min(1 , {message : "Enter college name"}),
    location : z.string().min(1 , {message : "Enter correct location"}),
    phoneNumber : z
            .string()
            .length(10, { message: "Phone number must be exactly 10 digits" })
            .regex(/^[6-9]\d{9}$/, {message: "Enter a valid 10-digit Indian phone number",})


})

