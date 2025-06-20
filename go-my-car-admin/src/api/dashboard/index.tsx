import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

const DASHBOARD_ROUTES = {
  DASHBOARD: BASE_API_URL + '/api/admin/dashboard',
};

export const getDashboard = async (data: any) => {
  console.log(data, 'dataaaaa');

  return request('post', DASHBOARD_ROUTES.DASHBOARD, data, {
    params: data || {},
  });
};
