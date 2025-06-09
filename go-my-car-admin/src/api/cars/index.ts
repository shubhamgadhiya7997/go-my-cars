import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  COUPONS: `${BASE_AUTH_ROUTE}/api`,
};

export const createCar = async data => {
  return request('post', `${ROUTES.COUPONS}/addcar`, data);
};

export const updateCars = async ({
  id,
  data,
}: {
  couponId: string;
  data: Record<string, any>;
}) => {
   console.log("1data", data)
  console.log("1id", id)
  return request('put', `${ROUTES.COUPONS}/updatecar` + `/${id}`, data);
};

export const resetCoupon = async couponId => {
  return request('put', ROUTES.COUPONS + `/reset/${couponId}`);
};
export const deleteCars = async couponId => {
  return request('delete', ROUTES.COUPONS + `/deletecar/${couponId}`);
};

export const getCars = async params => {
  return request('get', `${ROUTES.COUPONS}/getcar` , null, { params });
};

export const getViewCars = async (id: string) => {
  return request('get', `${ROUTES.COUPONS}/viewcar` + `/${id}`);
};

