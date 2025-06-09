import {
  getbookings
} from '@/api/Bookings';
import { useMutation, useQuery } from '@tanstack/react-query';



export const useGetBookings = params => {
  return useQuery({
    queryKey: [params], // Ensures query re-fetches when params change
    queryFn: () => getbookings(params), // Calls API function
  });
};


