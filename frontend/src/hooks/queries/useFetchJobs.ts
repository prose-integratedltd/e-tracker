import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/lib/queries/getJobs";

type FetchJobsParams = {
	search?: string;
	progress?: number;
	status?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: string;
	startDate?: string;
	endDate?: string;
};

export const useFetchJobs = (params?: FetchJobsParams) => {
	return useQuery({
		queryKey: ["jobs", params],
		queryFn: () => getJobs(params),
		staleTime: 1000 * 60 * 5,
		retry: 2,
	});
};
