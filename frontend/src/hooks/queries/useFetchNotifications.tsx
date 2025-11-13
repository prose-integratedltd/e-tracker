import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/lib/queries/getNotifications";

export const useFetchNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
