import { useMutation, useQuery } from '@tanstack/react-query';
import { createMedia, deleteMediaAssets, getMediaAssetsById } from '@/api/mediaAssets';
import { createFees, createPrivacy, createSetting, getSetting } from '@/api/setting';

const MEDIA_QUERY_KEY = ['media'];


export const useSetting = params => {
  console.log("params", params)
  return useQuery({
    queryKey: [params], // Ensures query re-fetches when params change
    queryFn: () => getSetting(params), // Calls API function
  });
};

export const useCreateSetting = onSuccessHandler => {
  return useMutation({
    mutationFn: createSetting,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};

export const useCreatePrivacy = onSuccessHandler => {
  return useMutation({
    mutationFn: createPrivacy,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};

export const useCreateFees = onSuccessHandler => {
  return useMutation({
    mutationFn: createFees,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};