import { useMutation, useQuery } from '@tanstack/react-query';

import { createNotification, getNotificationList } from '@/api/notification';

const FAQ_QUERY_KEY = ['faq'];
const NOTIFICATION_QUERY_KEY = ['notification'];

export const useGetNotificationList = (id) => {
    console.log("1id", id)
  return useQuery({
    queryKey: [id],
    queryFn: () => getNotificationList(id),
  });
};

export const useCreateNotification = (onSuccessHandler: any) => {
  return useMutation({
    mutationFn: createNotification,
    retry: false,
    onSuccess: (data) => {
      onSuccessHandler(data);
    },
  });
};
