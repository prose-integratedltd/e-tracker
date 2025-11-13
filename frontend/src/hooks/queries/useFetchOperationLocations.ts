import { useQuery } from "@tanstack/react-query";
import { getOperationLocations } from "@/lib/queries/getOperationLocations";

export const useFetchOperationLocations = () => {
  return useQuery({
    queryKey: ["operation-locations"],
    queryFn: getOperationLocations,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
