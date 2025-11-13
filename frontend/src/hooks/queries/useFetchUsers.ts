import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/queries/getUsers";

type FetchUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const useFetchUsers = (params?: FetchUsersParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
