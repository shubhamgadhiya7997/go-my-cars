import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  COUPONS: `${BASE_AUTH_ROUTE}/api`,
};



export const getPartners = async params => {
  return request('get', `${ROUTES.COUPONS}/getpartner` , null, { params });
};

export const viewPartners = async (id: string) => {
  return request('get', `${ROUTES.COUPONS}/viewpartner` + `/${id}`);
};


export const updatePartners = async ({
  id,
  data,
}: {
  id: string;
  data: Record<string, any>;
}) => {
   console.log("1data", data)
  console.log("1id", id)
  return request('put', `${ROUTES.COUPONS}/updatepartner` + `/${id}`, data);
};