import { getUser } from "@/lib/queries/getUser";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserDetails = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id), 
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
