import { getDashboard } from '@/api/dashboard';
import { useQuery } from '@tanstack/react-query';

const DASHBOARD_QUERY_KEY = ['dashboard'];

export const useDashboard = (data) => {
  return useQuery({
    queryKey: [data],
    queryFn: () => getDashboard(data),
  });
};

// export const useDashboard = () => {
//   return useQuery({
//     queryKey: [],
//     queryFn: () => getDashboard,
//     staleTime: 0,
//     refetchOnMount: true,
//   });
// };
