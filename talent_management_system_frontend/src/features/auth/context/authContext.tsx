import { createContext, useState, useEffect, type ReactNode } from "react";
import type {
	AuthContextType,
	AuthUser,
	LoginFormData,
	SignupFormData,
} from "../types/auth.types";
import { authService } from "../services/authService";
import { useToast } from "../../../components/common/toast/hooks/useToast";
import { handleError } from "../../../errors/utils/errorHandling";

type AuthState = {
	user: AuthUser | null;
	loading: boolean;
	error: string | null;
};

const AuthContext = createContext<AuthContextType & AuthState | null>(null);

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<AuthState>({
		user: null,
		loading: true,
		error: null,
	});
	const { addToast } = useToast();

	// Check if user is logged in on mount
	useEffect(() => {
		const checkAuth = async () => {
			try {
				await authService.refreshToken();
				const user = await authService.getCurrentUser();
				setState({ user, loading: false, error: null });
			} catch (error) {
				// Silently handle refresh token failures (expired/invalid tokens)
				// This is expected when tokens expire
				console.debug('Auth check failed:', error);
				setState({ user: null, loading: false, error: null });
			}
		};

		checkAuth();

		// Listen for logout events from axios interceptor
		const handleLogout = () => {
			setState({ user: null, loading: false, error: null });
		};

		window.addEventListener('auth:logout', handleLogout);

		return () => {
			window.removeEventListener('auth:logout', handleLogout);
		};
	}, []);

	const login = async (data: LoginFormData) => {
		setState(prev => ({ ...prev, loading: true, error: null }));
		try {
			const authUser = await authService.login(data);
			setState({ user: authUser, loading: false, error: null });
			return authUser;
		} catch (error: unknown) {
			handleError(error, {
				addToast,
				setError: (msg) => setState(prev => ({ ...prev, loading: false, error: msg })),
			});
			throw error;
		}
	};

	const signup = async (data: SignupFormData) => {
		setState(prev => ({ ...prev, loading: true, error: null }));
		try {
			const authUser = await authService.signup(data);
			setState({ user: authUser, loading: false, error: null });
			return authUser;
		} catch (error: unknown) {
			handleError(error, {
				addToast,
				setError: (msg) => setState(prev => ({ ...prev, loading: false, error: msg })),
			});
			throw error;
		}
	};

	const logout = async () => {
		setState(prev => ({ ...prev, loading: true, error: null }));
		try {
			await authService.logout();
			setState({ user: null, loading: false, error: null });
		} catch (error: unknown) {
			handleError(error, {
				setError: (msg) => setState(prev => ({ ...prev, loading: false, error: msg })),
			});
			// Clear user even if logout request fails
			setState({ user: null, loading: false, error: null });
		}
	};

	const forceLogout = () => {
		setState({ user: null, loading: false, error: null });
	};

	return (
		<AuthContext.Provider value={{ ...state, login, signup, logout, forceLogout }}>
			{children}
		</AuthContext.Provider>
	);
}
