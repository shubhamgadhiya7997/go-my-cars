import { createBanner, deleteBanner, getBanner, getBannerId, updateBanner, updateBannerId } from '@/api/banner';

import { useMutation, useQuery } from '@tanstack/react-query';

export const useCreateBanner= onSuccessHandler => {
  return useMutation({
    mutationFn: createBanner,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};

export const useUpdateBanner = onSuccessHandler => {
  return useMutation({
    mutationFn: updateBanner,
    retry: false,
     onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};

export const useUpdateBannerId = onSuccessHandler => {
  
  return useMutation({
    mutationFn: updateBannerId,
    retry: false,
     onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};

export const usedeleteBanner = onSuccessHandler => {
  return useMutation({
    mutationFn: deleteBanner,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};


export const useGetBanner = params => {
  console.log("params", params)
  return useQuery({
    queryKey: [params], // Ensures query re-fetches when params change
    queryFn: () => getBanner(params), // Calls API function
  });
};

export const useGetBannerId = params => {
  console.log("params", params)
  return useQuery({
    queryKey: [params], // Ensures query re-fetches when params change
    queryFn: () => getBannerId(params), // Calls API function
  });
};
