import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
 CREATENOTIFICATION: BASE_AUTH_ROUTE + '/api/admin/addnotification',
  NOTIFICATION: BASE_AUTH_ROUTE + '/api/admin/getnotification',
};

export const getNotificationList = async (params: any) => {
  return request('get', ROUTES.NOTIFICATION, null, { params });
};

export const createNotification = async (data: any) => {
  return request('post', ROUTES.CREATENOTIFICATION, data);
};