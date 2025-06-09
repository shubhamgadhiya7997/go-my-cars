import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  CATEGORY: BASE_AUTH_ROUTE,
};


export const createSetting = async (data: any) => {
  return request('post', `${ROUTES.CATEGORY}/api/addterms`, data);
};

export const createPrivacy = async (data: any) => {
  return request('post', `${ROUTES.CATEGORY}/api/addprivacy`, data);
};
export const getSetting = async (id: string) => {
  return request('get', `${ROUTES.CATEGORY}/api/getsetting` );
};

