import { useQuery } from "@tanstack/react-query";
import { getJobTypes } from "@/lib/queries/getJobTypes";
import { instance } from "@/lib/api";

export const useFetchJobTypes = () => {
	return useQuery({
		queryKey: ["job-types"],
		queryFn: getJobTypes,
		staleTime: 1000 * 60 * 5,
		retry: 2,
	});
};

export interface JobType {
	id: string;
	name: string;
	description: string;
}

export const useJobTypes = () => {
	return useQuery({
		queryKey: ["job-types"],
		queryFn: async () => {
			const response = await instance.get<JobType[]>("/jobs/get/types");
			return response?.data;
		},
		staleTime: 1000 * 60 * 5,
		retry: 2,
	});
};

export const useJobType = (id: string) => {
	return useQuery({
		queryKey: [id],
		queryFn: async () => {
			const response = await instance.get<JobType>(
				`/jobs/get/types/${id}`
			);
			return response?.data;
		},
		staleTime: 1000 * 60 * 5,
		retry: 2,
	});
};
