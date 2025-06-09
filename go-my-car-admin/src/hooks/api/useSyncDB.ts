import { useMutation } from "@tanstack/react-query";
import { fetchDataByModel } from "@/api/syncDBApi"; // Import API function

export const useSyncDB = () => {
  return useMutation({
    mutationFn: fetchDataByModel, // API function
    onSuccess: (data) => {
      console.log("Sync Successful:", data);
    },
    onError: (error) => {
      console.error("Sync Error:", error);
    },
  });
};
