import { z } from "zod";

export const registerSchema = z.object({
    name: z.string({
        required_error:"Username is required",
    }),
    email: z
    .string({
        required_error:"Email is required",
    })
    .email({
        message: "Invalid email",
    }),
    password_hash: z.
    string({
        required_error:"Password is required",
    })
    .min(6, {
        message:"Password must be at least 6 characters",
    }),
});

export const loginSchema = z.object({
    email: z
    .string({
        required_error:"Email is required",
    })
    .email({
        message: "Invalid email",
    }),
    password_hash: z.
    string({
        required_error:"Password is required",
    })
    .min(6, {
        message:"Password must be at least 6 characters",
    }),
});

