import { BASE_API_URL } from '@/utils/constants';
import api, { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  GET_USERS: BASE_AUTH_ROUTE + "/api" +  '/getuser',
  ACTIVE_INACTIVE: BASE_AUTH_ROUTE +  "/api" + '/edituser',
  USERS: BASE_AUTH_ROUTE +  "/api" + '/deleteuser'
};
// Users List API Call
export const getUsersApi = async (params: any) => {
  console.log("params2", params)
  return request('get', ROUTES.GET_USERS, null, { params });
};

export const activeInactiveUser = async (data: any) => {
  return request('post', ROUTES.ACTIVE_INACTIVE, data);
};
export const deleteUsers = async (data: any) => {
  return request('post', ROUTES.USERS, data);
};

