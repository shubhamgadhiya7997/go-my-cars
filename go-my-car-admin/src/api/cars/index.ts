import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  CARS: `${BASE_AUTH_ROUTE}/api`,
};

export const createCar = async (data: any) => {
  return request('post', `${ROUTES.CARS}/addcar`, data);
};

export const updateCars = async ({
  id,
  data,
}: {
  couponId: string;
  data: Record<string, any>;
  id: Record<string, any>;
}) => {
   console.log("1data", data)
  console.log("1id", id)
  return request('put', `${ROUTES.CARS}/updatecar` + `/${id}`, data);
};


export const deleteCars = async (couponId: any) => {
  return request('delete', ROUTES.CARS + `/deletecar/${couponId}`);
};

export const getCars = async (params: any) => {
  return request('get', `${ROUTES.CARS}/getcar` , null, { params });
};

export const getViewCars = async (id: string) => {
  return request('get', `${ROUTES.CARS}/viewcar` + `/${id}`);
};

