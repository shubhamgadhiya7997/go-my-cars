import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  COUPONS: `${BASE_AUTH_ROUTE}/api`,
};



export const getSupports = async params => {
  return request('get', `${ROUTES.COUPONS}/getsupport` , null, { params });
};

export const viewSupports = async (id: string) => {
  return request('get', `${ROUTES.COUPONS}/viewsupport` + `/${id}`);
};

// export const createSupports = async (data: any) => {
//   return request('post', `${ROUTES.CATEGORY}/api/updatesuppport`, data);
// };

export const updateSupports = async ({
  id,
  data,
}: {
  id: string;
  data: Record<string, any>;
}) => {
   console.log("1data", data)
  console.log("1id", id)
  return request('put', `${ROUTES.COUPONS}/updatesuppport` + `/${id}`, data);
};