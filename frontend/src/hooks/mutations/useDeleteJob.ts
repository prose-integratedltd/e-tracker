import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJob } from "@/lib/queries/deleteJob";

export const useDeleteJob = () => {
	const client = useQueryClient();
	
	return useMutation({
		mutationFn: deleteJob,
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["jobs", {}] });
		},
		onError: (error) => {
			console.error("Error deleting job:", error);
		},
	});
};
