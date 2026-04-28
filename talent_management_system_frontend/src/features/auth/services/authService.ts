import api, { setAccessToken, clearAccessToken } from '../../../api/axios';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '../../../api/endpoints';
import type { AuthUser, LoginFormData, SignupFormData, ChangePasswordFormData, LoginActivity } from '../types/auth.types';

export const authService = {
  async login(data: LoginFormData) {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, data);
    const { accessToken, user } = response.data.data;

    setAccessToken(accessToken);

    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role && user.role.length > 0 ? user.role[0] : 'user',
    } as AuthUser;
  },

  async signup(data: SignupFormData) {
    const payload = {
      email: data.email,
      full_name: data.fullName,
      password_hash: data.password,
      phone_number: data.phoneNumber,
    };
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, payload);
    const user = response.data.data;

    // For signup, we might not get a token immediately, or we need to login after
    // For now, assume signup returns user, and we can login separately
    return {
      id: user.id,
      fullName: user.full_name || data.fullName,
      email: user.email,
      role: user.role && user.role.length > 0 ? user.role[0] : 'user',
    } as AuthUser;
  },

  async logout() {
    await api.post(AUTH_ENDPOINTS.LOGOUT);
    clearAccessToken();
  },

  async refreshToken() {
    const response = await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
    const accessToken = response.data?.data?.accessToken;
    if (typeof accessToken === 'string') {
      setAccessToken(accessToken);
      return accessToken;
    }
    throw new Error('Unable to refresh access token');
  },

  async getCurrentUser() {
    const response = await api.get(AUTH_ENDPOINTS.ME);
    const user = response.data.data;
    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role && user.role.length > 0 ? user.role[0] : 'user',
    } as AuthUser;
  },

  async changePassword(data: ChangePasswordFormData) {
    const payload = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    const response = await api.patch(USER_ENDPOINTS.CHANGE_PASSWORD, payload);
    return response.data;
  },

  async getLoginActivity(): Promise<LoginActivity[]> {
    const response = await api.get(AUTH_ENDPOINTS.LOGIN_ACTIVITY);
    return response.data.data || [];
  },
};
