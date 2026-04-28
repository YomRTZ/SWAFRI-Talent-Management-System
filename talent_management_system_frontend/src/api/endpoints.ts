// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  ME: '/auth/me',
  LOGIN_ACTIVITY: '/auth/login-activity',
} as const;

// User/Talent endpoints
export const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  GET_USERS: '/user',
  GET_USER: (id: string) => `/user/${id}`,
  UPDATE_USER: (id: string) => `/user/${id}`,
  DELETE_USER: (id: string) => `/user/${id}`,
} as const;
