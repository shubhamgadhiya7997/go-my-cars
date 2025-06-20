import { useMutation, useQuery } from '@tanstack/react-query';
import { activeInactiveUser, deleteUsers, getUsersApi } from '@/api/users'; // Adjust the import path as needed

const USERS_QUERY_KEY = ['users'];

export const useUsers = (params: Record<string, any>) => {
  console.log("params", params)
  return useQuery({
    queryKey: [ params], // Ensures query re-fetches when params change
    queryFn: () => getUsersApi(params), // Calls API function
    // staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });
};

export const activeInactiveUserHook = (onSuccessHandler) => {
  return useMutation({
    mutationFn: activeInactiveUser,
    retry: false,
    onSuccess: (data) => {
      onSuccessHandler(data);
    },
  });
};

export const useDeleteUsers = onSuccessHandler => {
  return useMutation({
    mutationFn: deleteUsers,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};