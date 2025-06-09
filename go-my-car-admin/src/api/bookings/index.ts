import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  COUPONS: `${BASE_AUTH_ROUTE}/api`,
};

export const getbookings = async params => {
  return request('get', `${ROUTES.COUPONS}/getAllBooking` , null, { params });
};


