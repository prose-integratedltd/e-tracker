import { useMutation } from "@tanstack/react-query";
import { deleteTemplate } from "@/lib/queries/deleteTemplate";

export const useDeleteTemplate = () => {
	return useMutation({
		mutationFn: deleteTemplate,
		onError: (error) => {
			console.error("Error deleting Email template:", error);
		},
	});
};
