import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  BOOKINGS: `${BASE_AUTH_ROUTE}/api`,
};

export const getbookings = async (params: any) => {
  return request('get', `${ROUTES.BOOKINGS}/getAllBooking` , null, { params });
};

export const cancelBookings = async (id: string) => {
  return request('get', `${ROUTES.BOOKINGS}/cancelbooking` + `/${id}`);
};
