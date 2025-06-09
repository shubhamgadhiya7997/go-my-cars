import api, { axiosRequestWrapper, request } from './api';
import { AxiosError } from 'axios';

// Fetch Data by Model
export const fetchDataByModel = async (data: Record<string, any>) => {
  return request('post', '/syncDB', data);
};
