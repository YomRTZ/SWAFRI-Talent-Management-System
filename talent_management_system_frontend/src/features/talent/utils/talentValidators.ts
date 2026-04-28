import { z } from "zod";

export const talentSchema = z.object({
  fullName: z.string().min(1, "Full name is required").min(2, "Full name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  primarySkill: z.string().min(1, "Primary skill is required").min(2, "Primary skill must be at least 2 characters"),
  experience: z.number().int().min(0, "Experience must be a positive number").max(50, "Experience cannot exceed 50 years"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
});

export type TalentFormData = z.infer<typeof talentSchema>;