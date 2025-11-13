import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "@/lib/queries/getDeparments";

export const useFetchDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
