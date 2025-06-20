import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  SETTING: BASE_AUTH_ROUTE,
};


export const createSetting = async (data: any) => {
  return request('post', `${ROUTES.SETTING}/api/addterms`, data);
};

export const createFees = async (data: any) => {
  return request('post', `${ROUTES.SETTING}/api/addfees`, data);
};

export const createPrivacy = async (data: any) => {
  return request('post', `${ROUTES.SETTING}/api/addprivacy`, data);
};
export const getSetting = async (id: string) => {
  return request('get', `${ROUTES.SETTING}/api/getsetting` );
};

