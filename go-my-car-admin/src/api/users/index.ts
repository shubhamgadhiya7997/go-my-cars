import { BASE_API_URL } from '@/utils/constants';
import api, { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  GET_USERS: BASE_AUTH_ROUTE + "/api" +  '/getuser',
  ACTIVE_INACTIVE: BASE_AUTH_ROUTE +  "/api" + '/edituser'
};
// Users List API Call
export const getUsersApi = async (params) => {
  return request('get', ROUTES.GET_USERS, null, { params });
};

export const activeInactiveUser = async (data) => {
  return request('post', ROUTES.ACTIVE_INACTIVE, data);
};

