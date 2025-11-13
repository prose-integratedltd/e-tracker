import { instance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export type Location = {
	address: string;
	longitude: number;
	latitude: number;
};

export type JobStatusUpdate = {
	id?: string;
	jobId: string;
	title?: string;
	description?: string;
	completed?: boolean;
	location?: Location;
	time?: string;
	date?: string;
};

const getJobStatusUpdates = async (id: string): Promise<JobStatusUpdate[]> => {
	return instance
		.get(`/job-status-updates?jobId=${id}`)
		.then((res) => res.data.data);
};

export const useFetchJobStatusUpdates = (id: string) => {
	return useQuery({
		queryKey: [`status-update-${id}`],
		queryFn: () => getJobStatusUpdates(id),
		staleTime: 1000 * 60 * 5,
		retry: 2,
	});
};
