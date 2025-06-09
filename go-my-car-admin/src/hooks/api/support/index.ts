import { createSupports, getSupports, updateSupports, viewSupports } from '@/api/support';
import { useMutation, useQuery } from '@tanstack/react-query';


export const useGetSupport = id => {
  console.log("1id", id)
  return useQuery({
    queryKey: [id], // Ensures query re-fetches when params change
    queryFn: () => getSupports(id), // Calls API function
  });
};
export const useViewSupport = id => {
  console.log("1id", id)
  return useQuery({
    queryKey: [id], // Ensures query re-fetches when params change
    queryFn: () => viewSupports(id), // Calls API function
  });
};

export const useUpdateSupport = onSuccessHandler => {
  return useMutation({
    mutationFn: updateSupports,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};