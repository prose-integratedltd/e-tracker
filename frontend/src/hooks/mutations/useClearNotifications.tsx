import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "@/lib/api";

const clearAll = async () => {
	try {
		await instance.delete("/notifications/clear");
	} catch (error) {
		console.error("Error clearing notifications:", error);
	}
};

export const useClearNotifications = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: clearAll,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			console.error("Error deleting notifications:", error);
		},
	});
};
