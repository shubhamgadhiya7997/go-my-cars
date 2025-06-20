
import { cancelBookings, getbookings } from '@/api/bookings';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetBookings = params => {
  return useQuery({
    queryKey: [params], // Ensures query re-fetches when params change
    queryFn: () => getbookings(params), // Calls API function
  });
};

export const useCancelBookings = onSuccessHandler => {
  return useMutation({
    mutationFn: cancelBookings,
    retry: false,
    onSuccess: data => {
      onSuccessHandler(data);
    },
  });
};

