import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/lib/queries/getStats";

export const useFetchStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
