
import { useMutation } from "@tanstack/react-query";
import { handleApiError } from "../useApiError";
import { changePasswordApi } from "@/api/auth";

export const useChangePasswordMutation = (successHandler) => {
  return useMutation({
    mutationFn: changePasswordApi,
    onSuccess: (data) => {
      if (data?.success == false) {
        handleApiError(data);
      }
      if (data?.success == true) {
        successHandler(data);
      }
    },
    onError: (error: any) => {},
  });
};
