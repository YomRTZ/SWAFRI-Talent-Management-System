import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email("Invalid email").optional(),
  phone_number: z.string().min(9).optional(),
  password_hash: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(5, "Full name required"),
  role: z.enum(["user", "admin"]).default("user"),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email required"),
  password: z.string().min(6, "Password required"),
}).or(
  z.object({
    email: z.string().min(1, "Email required"),
    password_hash: z.string().min(6, "Password required"),
  })
);
export const logoutSchema = z.object({
  token: z.string().min(1, "Refresh token required").optional(),
});

export const refreshTokenSchema = z.object({
  token: z.string().min(1, "Refresh token required"),
});
export const updateUserSchema = z.object({
  full_name: z.string().min(1, "Full name required").optional(),
  phone_number: z.string().min(9, "Phone must be at least 9 digits").optional(),
  email: z.string().email("Invalid email").optional(),
});
