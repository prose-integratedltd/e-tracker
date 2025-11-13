import { JobStatusUpdate } from "./useFetchJobStatusUpdates";
import { useQuery } from "@tanstack/react-query";
import { instance } from "@/lib/api";

const getJobStatusUpdates = async (id: string): Promise<JobStatusUpdate[]> => {
	return instance
		.get(`/job-status-updates?trackingId=${id}`)
		.then((res) => res.data.data);
};

export const useFetchJobStatusUpdatesByTrackingId = (id: string) => {
	return useQuery({
		queryKey: [id],
		queryFn: () => getJobStatusUpdates(id),
		staleTime: 1000 * 60 * 5,
		retry: 2,
	});
};
