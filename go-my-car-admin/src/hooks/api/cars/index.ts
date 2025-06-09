import {
  createCar,
  deleteCars,
  getCars,
  getViewCars,
  updateCars,
} from '@/api/cars';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCreateCar = onSuccessHandler => {
  return useMutation({
    mutationFn: createCar,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};

export const useDeleteCars = onSuccessHandler => {
  return useMutation({
    mutationFn: deleteCars,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};

export const useGetCars = params => {
  return useQuery({
    queryKey: [params], // Ensures query re-fetches when params change
    queryFn: () => getCars(params), // Calls API function
  });
};

export const useGetViewCars = (id: string) => {
  return useQuery({
    queryKey: [id],
    queryFn: () => getViewCars(id),
    staleTime: 0,
    refetchOnMount: true,
  });
};

export const useUpdateCars = onSuccessHandler => {
  return useMutation({
    mutationFn: updateCars,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};