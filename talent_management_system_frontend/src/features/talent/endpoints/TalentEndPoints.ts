export const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  GET_USERS: '/user',
  GET_USER: (id: string) => `/user/${id}`,
  UPDATE_USER: (id: string) => `/user/${id}`,
  DELETE_USER: (id: string) => `/user/${id}`,
} as const;
