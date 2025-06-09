import { getPartners, updatePartners, viewPartners } from '@/api/partner';
import { getSupports } from '@/api/support';
import { useMutation, useQuery } from '@tanstack/react-query';


export const useGetPartner = params => {
  return useQuery({
    queryKey: [params], // Ensures query re-fetches when params change
    queryFn: () => getPartners(params), // Calls API function
  });
};

export const useViewPartner = id => {
  console.log("1id", id)
  return useQuery({
    queryKey: [id], // Ensures query re-fetches when params change
    queryFn: () => viewPartners(id), // Calls API function
  });
};

export const useUpdatePartner = onSuccessHandler => {
  return useMutation({
    mutationFn: updatePartners,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};