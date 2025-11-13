import { getAuthUser } from "@/lib/queries/getAuthUser";
import { useQuery } from "@tanstack/react-query";

export const useFetchAuthUser = () => {
  return useQuery({
    queryKey: ["auth-user"],
    queryFn: () => getAuthUser(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
