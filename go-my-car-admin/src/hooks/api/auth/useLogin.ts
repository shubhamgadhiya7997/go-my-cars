import { loginApi } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';

import Toast from '@/components/toast/commonToast';

export const useLoginMutation = (onSuccessHandler) => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      console.log("Data", data)
      sessionStorage.setItem('userEmail', data?.data?.adminDetails?.email);

      if (!data?.success) {
        Toast(
          'destructive',
          'Login Failed',
          data?.message || 'Invalid Email or Password!'
        );
        return;
      }
      const payload = data?.data;
      const { token, ...adminDetails } = payload;
      if (token) {
        onSuccessHandler(token, adminDetails);
      }
    },
  });
};
