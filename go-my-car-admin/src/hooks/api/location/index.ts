import { createLocation, deleteLocation, getLocation, updateLocation, viewLocation } from '@/api/location';

import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetLocation = params => {
  console.log("params", params)
  return useQuery({
    queryKey: [params], // Ensures query re-fetches when params change
    queryFn: () => getLocation(params), // Calls API function
  });
};

export const useCreateLocation = onSuccessHandler => {
  return useMutation({
    mutationFn: createLocation,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};

export const useViewLocation = id => {
  console.log("1id", id)
  return useQuery({
    queryKey: [id], // Ensures query re-fetches when params change
    queryFn: () => viewLocation(id), // Calls API function
  });
};

export const useUpdateLocation = onSuccessHandler => {
  return useMutation({
    mutationFn: updateLocation,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};

export const useDeleteLocation = onSuccessHandler => {
  return useMutation({
    mutationFn: deleteLocation,
    retry: false,
    onSuccess: data => {
      console.log("✅ onSuccess", data)
      onSuccessHandler(data);
    },
  });
};