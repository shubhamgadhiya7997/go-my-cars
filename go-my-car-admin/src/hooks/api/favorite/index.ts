import { getFavorite } from '@/api/favorite';

import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetFavorite = params => {
  console.log("params", params)
  return useQuery({
    queryKey: [params], // Ensures query re-fetches when params change
    queryFn: () => getFavorite(params), // Calls API function
  });
};
