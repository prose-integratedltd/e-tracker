import { StatusUpdateDto } from "@/dto/status.update.dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "@/lib/api";
import axios from "axios";

const createJobStatusUpdate = async (
	payload: StatusUpdateDto
): Promise<StatusUpdateDto> => {
	return instance
		.post(`/job-status-updates`, payload)
		.then((res) => res.data);
};

export const useCreateJobStatusUpdate = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createJobStatusUpdate,
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [`status-update-${data.jobId}`],
			});
		},
		onError(error) {
			if (axios.isAxiosError(error)) return error.response?.data;
			return error;
		},
	});
};
