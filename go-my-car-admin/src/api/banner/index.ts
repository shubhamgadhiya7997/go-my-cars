import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  COUPONS: `${BASE_AUTH_ROUTE}/api`,
};

export const createBanner = async data => {
  return request('post', `${ROUTES.COUPONS}/addcarbanner`, data);
};

export const updateBanner = async ({
  userId,
  isSelected,
}: {
  is: string;
  isSelected: Record<string, any>;
}) => {
  console.log("data", isSelected)
  return request('put', `${ROUTES.COUPONS}/updatecarbanner` + `/${userId}`, {isSelected});
};
export const updateBannerId = async ({
  id,
  data,
}: {
  id: string;
  data: Record<string, any>;
}) => {
  console.log("1data", data)
  console.log("1id", id)
  return request('put', `${ROUTES.COUPONS}/updatecarbanner` + `/${id}`, data);
};

export const deleteBanner = async couponId => {
  return request('delete', ROUTES.COUPONS + `/deletecarbanner/${couponId}`);
};

export const getBanner = async params => {
  return request('get', `${ROUTES.COUPONS}/getcarbanner` , null, { params });
};

export const getBannerId = async id => {
  return request('get', `${ROUTES.COUPONS}/getcarbanner` + `/${id}`);
}

export const getViewBanner = async (couponId: string) => {
  return request('get', `${ROUTES.COUPONS}/viewcar` + `/${couponId}`);
};
