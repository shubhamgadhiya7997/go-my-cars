import { createCoupons, deleteCoupons, getCoupons, updateCoupons, viewCoupons } from '@/api/coupon';
import { useMutation, useQuery } from '@tanstack/react-query';


export const useGetCoupon = params => {
  console.log("1id", params)
  return useQuery({
    queryKey: [params], // Ensures query re-fetches when params change
    queryFn: () => getCoupons(params), // Calls API function

  });
};

export const useCreateCoupon = onSuccessHandler => {
  return useMutation({
    mutationFn: createCoupons,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};

export const useViewCoupon = id => {
  console.log("1id", id)
  return useQuery({
    queryKey: [id], // Ensures query re-fetches when params change
    queryFn: () => viewCoupons(id), // Calls API function
  });
};

export const useUpdateCoupon = onSuccessHandler => {
  return useMutation({
    mutationFn: updateCoupons,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};

export const useDeleteCoupon = onSuccessHandler => {
  return useMutation({
    mutationFn: deleteCoupons,
    retry: false,
    onSuccess: data => {
      console.log("✅ onSuccess", data)
      onSuccessHandler(data);
    },
  });
};