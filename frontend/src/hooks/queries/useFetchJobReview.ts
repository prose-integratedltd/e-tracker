import { useQuery } from "@tanstack/react-query";
import { instance } from "@/lib/api";

type JobReview = {
	id?: string;
	jobId?: string;
	rating?: number;
	comment?: string;
};

export const useFetchJobReview = (jobId: string) => {
	return useQuery({
		queryKey: [`job-review-${jobId}`],
		queryFn: () => getJobReview(jobId),
		staleTime: 1000 * 60 * 5,
		retry: 2,
	});
};

export const getJobReview = async (jobId: string): Promise<JobReview> => {
	const response = await instance.get(`/job-reviews/${jobId}`);
	return response.data;
};
