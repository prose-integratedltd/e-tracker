import { useQuery } from "@tanstack/react-query";
import { getMailTemplates } from "@/lib/queries/getMailTemplates";

type FetchTemplatesParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const useFetchMailTemplates = (params?: FetchTemplatesParams) => {
  return useQuery({
    queryKey: ["mail-templates", params],
    queryFn: () => getMailTemplates(params),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
