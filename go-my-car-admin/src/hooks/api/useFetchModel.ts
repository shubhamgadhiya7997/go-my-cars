import { useQuery } from "@tanstack/react-query";
import { fetchDataByModel } from "@/api/syncDBApi";

export const useFetchModel = () => {
  return useQuery({
    queryKey: ["modelData"], // Unique cache key
    queryFn: fetchDataByModel, // Pass function reference
  });
};
