import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignupPage";
import ForgotPasswordPage from "../pages/ForgotpasswordPage";
import ResetPasswordPage from "../pages/ResetpasswordPage";
import LogoutPage from "../pages/LogoutPage";

export default function AuthRoutes() {
	return (
		<Routes>
			<Route path="/sign-in" element={<LoginPage />} />
			<Route path="/sign-up" element={<SignUpPage />} />
			<Route path="/forgot-password" element={<ForgotPasswordPage />} />
			<Route path="/reset-password" element={<ResetPasswordPage />} />
			<Route path="/logout" element={<LogoutPage />} />
		</Routes>
	);
}
