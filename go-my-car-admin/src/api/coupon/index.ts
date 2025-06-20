import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  COUPONS: `${BASE_AUTH_ROUTE}/api`,
};



export const getCoupons = async (params: any) => {
  return request('get', `${ROUTES.COUPONS}/getcoupon` , null, { params });
};

export const viewCoupons = async (id: string) => {
  return request('get', `${ROUTES.COUPONS}/getcoupon` + `/${id}`);
};

export const createCoupons = async (data: any) => {
  return request('post', `${ROUTES.COUPONS}/addcoupon`, data);
};

export const updateCoupons = async ({
  id,
  data,
}: {
  id: string;
  data: Record<string, any>;
}) => {
   console.log("1data", data)
  console.log("1id", id)
  return request('put', `${ROUTES.COUPONS}/updatecoupon` + `/${id}`, data);
};

export const deleteCoupons = async (id: any) => {
  return request('delete', ROUTES.COUPONS + `/deletecoupon/${id}`);
};