"use client";

import { instance } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { JobStatusUpdate } from "../queries/useFetchJobStatusUpdates";

export type UpdateJobStatusUpdate = {
	id: string;
	completed: boolean;
};

const updateJobStatusUpdate = async ({
	id,
	completed,
}: UpdateJobStatusUpdate): Promise<JobStatusUpdate> => {
	return instance
		.patch(`/job-status-updates/${id}`, { completed })
		.then((res) => res.data);
};

export const useUpdateJobStatusUpdate = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateJobStatusUpdate,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: [data.jobId] });
		},
		onError(error) {
			if (axios.isAxiosError(error)) {
				return error.response?.data;
			}

			return error;
		},
	});
};
