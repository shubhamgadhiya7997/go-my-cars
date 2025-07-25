import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

export const BASE_AUTH_ROUTE = BASE_API_URL;

const ROUTES = {
  LOCATION: `${BASE_AUTH_ROUTE}/api`,
};

export const getLocation = async (params: any) => {
  return request('get', `${ROUTES.LOCATION}/getlocation` , null, { params });
};

export const createLocation = async (data: any) => {
  return request('post', `${ROUTES.LOCATION}/addlocation`, data);
};

export const viewLocation = async (id: string) => {
  return request('get', `${ROUTES.LOCATION}/getlocation` + `/${id}`);
};
export const updateLocation = async ({
  id,
  data,
}: {
  id: string;
  data: Record<string, any>;
}) => {
   console.log("1data", data)
  console.log("1id", id)
  return request('put', `${ROUTES.LOCATION}/updatelocation` + `/${id}`, data);
};

export const deleteLocation = async (id: any) => {
    console.log("id", id)
  return request('delete', ROUTES.LOCATION + `/deletelocation/${id}`);
};