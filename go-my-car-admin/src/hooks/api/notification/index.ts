import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createFaq,
  deleteFaq,
  getFaq,
  getFaqById,
  updateFaqById,
} from '@/api/faqs';
import { createNotification, getNotificationList } from '@/api/notification';

const FAQ_QUERY_KEY = ['faq'];
const NOTIFICATION_QUERY_KEY = ['notification'];

export const useGetNotificationList = () => {
  return useQuery({
    queryKey: [NOTIFICATION_QUERY_KEY],
    queryFn: () => getNotificationList(),
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

export const useGetFaqByIdHook = (faqId: string) => {
  return useQuery({
    queryKey: [faqId],
    queryFn: () => getFaqById(faqId),
    staleTime: 0,
    refetchOnMount: true,
  });
};

export const useUpdateFaq = (onSuccessHandler: any) => {
  return useMutation({
    mutationFn: updateFaqById,
    retry: false,
    onSuccess: (data) => {
      onSuccessHandler(data);
    },
  });
};

export const useDeleteFaqHook = (onSuccessHandler: any) => {
  return useMutation({
    mutationFn: deleteFaq,
    retry: false,
    onSuccess: (data) => {
      onSuccessHandler(data);
    },
  });
};
