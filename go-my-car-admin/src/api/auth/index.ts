import { BASE_API_URL } from '@/utils/constants';
import api, { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL + '/api/admin';

const AUTH_ROUTES = {
  LOGIN: BASE_AUTH_ROUTE + '/login',
  LOGOUT: BASE_AUTH_ROUTE + '/logout',
  RESET_PASSWORD: BASE_AUTH_ROUTE + '/forgotpassword',
};

export const loginApi = async (data: Record<string, any>) => {
  return request('post', AUTH_ROUTES.LOGIN, data);
};

// Logout API Call
export const logoutApi = async () => {
  return request('get', AUTH_ROUTES.LOGOUT);
};

// Change Password API Call
export const changePasswordApi = async (data: Record<string, any>) => {
  return request('post', AUTH_ROUTES.RESET_PASSWORD, data);
};
