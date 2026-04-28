export interface Talent {
  id: string;
  fullName: string;
  email: string;
  primarySkill: string;
  experience: number;
  description: string;
  createdAt?: string;
  isProfileComplete?: boolean;
}
