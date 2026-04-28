import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email({ message: "Enter a valid email" }),
	password: z.string().min(6, "Password must be at least 6 characters"),
	rememberMe: z.boolean().optional(),
});

export const signupSchema = z.object({
	fullName: z.string().min(1, "Full name is required").min(2, "Full name must be at least 2 characters"),
	email: z.string().min(1, "Email is required").email({ message: "Enter a valid email address" }),
	password: z
		.string()
		.min(1, "Password is required")
		.min(6, "Password must be at least 6 characters")
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
			message: "Password must contain at least one lowercase letter, one uppercase letter, and one number",
		}),
	phoneNumber: z
		.string()
		.min(1, "Phone number is required")
		.regex(/^\+?[0-9]\d{1,14}$/, {
			message: "Enter a valid phone number",
		}),
});

export const forgotPasswordSchema = z.object({
	email: z.string().email({ message: "Enter a valid email" }),
});

export const resetPasswordSchema = z
	.object({
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(6, "Confirm password is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"],
	});
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(6, "Minimum 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})