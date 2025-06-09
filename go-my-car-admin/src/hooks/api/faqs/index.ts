import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createFaq,
  deleteFaq,
  getFaq,
  getFaqById,
  updateFaqById,
} from '@/api/faqs';

const FAQ_QUERY_KEY = ['faq'];

export const useGetFaqs = () => {
  return useQuery({
    queryKey: [FAQ_QUERY_KEY],
    queryFn: () => getFaq(),
  });
};

export const useCreateFaq = (onSuccessHandler: any) => {
  return useMutation({
    mutationFn: createFaq,
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
