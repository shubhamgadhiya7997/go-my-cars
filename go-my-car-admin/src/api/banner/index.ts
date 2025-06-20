import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  BANNERS: `${BASE_AUTH_ROUTE}/api`,
};

export const createBanner = async (data: any) => {
  return request('post', `${ROUTES.BANNERS}/addcarbanner`, data);
};

export const updateBanner = async ({
  userId,
  isSelected,
}: {
  userId: string;
  isSelected: boolean;
}) => {
  console.log("data", isSelected)
  return request('put', `${ROUTES.BANNERS}/updatecarbanner` + `/${userId}`, {isSelected});
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
  return request('put', `${ROUTES.BANNERS}/updatecarbanner` + `/${id}`, data);
};

export const deleteBanner = async (couponId: any) => {
  return request('delete', ROUTES.BANNERS + `/deletecarbanner/${couponId}`);
};

export const getBanner = async (params: any) => {
  return request('get', `${ROUTES.BANNERS}/getcarbanner` , null, { params });
};

export const getBannerId = async (id: any) => {
  return request('get', `${ROUTES.BANNERS}/getcarbanner` + `/${id}`);
}

export const getViewBanner = async (couponId: string) => {
  return request('get', `${ROUTES.BANNERS}/viewcar` + `/${couponId}`);
};
