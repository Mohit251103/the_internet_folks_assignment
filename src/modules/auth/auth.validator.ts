import { z } from "zod";

export const SignUpSchema = z.object({
    name: z.string()
        .min(2, "Name cannot be less than 2 characters")
        .max(25, "Name cannot be more than 25 characters long"),
    email: z.string().email("Should be a valid email"),
    password: z.string().min(6, "Minimum 6 characters long")
})

export const SignInSchema = z.object({
    email: z.string().email("Should be a valid email"),
    password: z.string().min(6, "Minimum 6 characters long")
})

export type SignUpData = z.infer<typeof SignUpSchema>;
export type SignInData = z.infer<typeof SignInSchema>;