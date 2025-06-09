import { loginApi, logoutApi } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';
import {
  setSessionStorageItem,
  setSessionStorageObject,
  setToken,
} from '@/utils/sessionStorage';
import { useNavigate } from 'react-router-dom';
import Toast from '@/components/toast/commonToast';

import { useQuery } from '@tanstack/react-query';

import Toast from '@/components/toast/commonToast';

export const useLogoutQuery = () => {
  return useQuery({
    queryKey: ['logout'],
    queryFn: async () => {
      const response = await logoutApi();
      return response;
    },

    enabled: false, // Prevent auto-fetching
  });
};
