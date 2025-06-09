import { BASE_API_URL } from '@/utils/constants';
import { request } from '../api';

const DASHBOARD_ROUTES = {
  DASHBOARD: BASE_API_URL + '/api/admin/dashboard',
};

// Get TradeTips
// export const getDashboard = () => {
//   return request('get', DASHBOARD_ROUTES.DASHBOARD);
// };

export const getDashboard = async (data) => {
  console.log(data, 'dataaaaa');

  return request('post', DASHBOARD_ROUTES.DASHBOARD, data, {
    params: data || {},
  });
};
