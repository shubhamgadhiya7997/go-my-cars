import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  SUPPORTS: `${BASE_AUTH_ROUTE}/api`,
};



export const getSupports = async (params: any) => {
  return request('get', `${ROUTES.SUPPORTS}/getsupport` , null, { params });
};

export const viewSupports = async (id: string) => {
  return request('get', `${ROUTES.SUPPORTS}/viewsupport` + `/${id}`);
};


export const updateSupports = async ({
  id,
  data,
}: {
  id: string;
  data: Record<string, any>;
}) => {
   console.log("1data", data)
  console.log("1id", id)
  return request('put', `${ROUTES.SUPPORTS}/updatesuppport` + `/${id}`, data);
};