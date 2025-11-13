import { getTemplate } from "@/lib/queries/getTemplate";
import { useQuery } from "@tanstack/react-query";

export const useFetchSingleTemplate = (id: string) => {
  return useQuery({
    queryKey: ["email-template", id],
    queryFn: () => getTemplate(id),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
