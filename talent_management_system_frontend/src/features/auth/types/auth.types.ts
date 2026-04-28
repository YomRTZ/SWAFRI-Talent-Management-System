export type AuthModalOption = "login" | "signup" | "forgot";

export type LoginFormData = {
	email: string;
	password: string;
	rememberMe?: boolean;
};

export type SignupFormData = {
	fullName: string;
	email: string;
	password: string;
	phoneNumber: string;
};

export type ForgotPasswordFormData = {
	email: string;
};

export type ResetPasswordFormData = {
	password: string;
	confirmPassword: string;
};

export type ChangePasswordFormData = {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
};

export type AuthUser = {
	id: string;
	fullName: string;
	email: string;
	role: string;
};

export type LoginActivity = {
	id: string;
	device: string;
	ip: string;
	createdAt: string;
	lastUsed: string;
};

export type AuthContextType = {
	user: AuthUser | null;
	login: (data: LoginFormData) => Promise<AuthUser>;
	signup: (data: SignupFormData) => Promise<AuthUser>;
	logout: () => Promise<void>;
	forceLogout: () => void;
};
