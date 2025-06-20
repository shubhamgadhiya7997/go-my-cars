import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  FAVORITE: `${BASE_AUTH_ROUTE}/api`,
};

export const getFavorite = async (params: any) => {
  return request('get', `${ROUTES.FAVORITE}/getfavorite` , null, { params });
};
