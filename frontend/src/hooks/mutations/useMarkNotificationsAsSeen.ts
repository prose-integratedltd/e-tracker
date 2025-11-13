import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "@/lib/api";

export const markNotificationsAsSeen = async (
	jobIds: string[]
): Promise<void> => {
	await instance.patch(`/notifications/mark-as-seen`, { ids: jobIds });
};

export const useMarkNotificationsAsSeen = () => {
	const client = useQueryClient();

	return useMutation<void, Error, { jobIds: string[] }>({
		mutationFn: ({ jobIds }) => markNotificationsAsSeen(jobIds),

		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["notifications"] });
		},

		onError: (error) => {
			console.error("Error marking notifications as seen:", error);
		},
	});
};
