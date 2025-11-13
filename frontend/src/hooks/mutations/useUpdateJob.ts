import {
	UpdateJobPayload,
	UpdateJobResponse,
	updateJob,
} from "@/lib/queries/updateJob";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CarHireJob } from "@/dto/car.hire.job.dto";
import { JobModel } from "../queries/useFetchJobDetails";
import { instance } from "@/lib/api";

export const useUpdateJob = () => {
	const queryClient = useQueryClient();

	return useMutation<
		UpdateJobResponse,
		Error,
		{ jobId: string; data: UpdateJobPayload }
	>({
		mutationFn: ({ jobId, data }) => updateJob(jobId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] });
			queryClient.invalidateQueries({ queryKey: ["job"] });
		},
		onError: (error) => {
			console.error("Error updating job:", error);
		},
	});
};

export const useUpdateCarHireJob = () => {
	const client = useQueryClient();

	return useMutation<JobModel, Error, { id: string; payload: CarHireJob }>({
		mutationFn: async ({ id, payload }) => {
			const response = await instance.patch(
				`/jobs/car-hire/${id}`,
				payload
			);
			return response?.data;
		},
		onSuccess: (data) => {
			client.invalidateQueries({ queryKey: ["jobs"] });
			client.invalidateQueries({ queryKey: [data.id] });
			client.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};
