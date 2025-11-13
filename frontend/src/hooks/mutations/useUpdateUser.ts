import {
	QueryClient,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	UpdateUserPayload,
	updateAuthUser,
	updateUser,
} from "@/lib/queries/updateUser";
import axios from "axios";
import { User } from "@/lib/queries/getUser";

export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation<
		User,
		Error,
		{ userId: string; data: UpdateUserPayload }
	>({
		mutationFn: ({ userId, data }) => updateUser(userId, data),
		onSuccess: (data) => onSuccess(data, queryClient),
		onError: onError,
	});
};

export const useUpdateAuthUser = () => {
	const queryClient = useQueryClient();

	return useMutation<User, Error, { payload: UpdateUserPayload }>({
		mutationFn: updateAuthUser,
		onSuccess: (data) => onSuccess(data, queryClient),
		onError: onError,
	});
};

function onSuccess(data: User, queryClient: QueryClient) {
	queryClient.setQueryData(["user", data.id], () => data);
	queryClient.invalidateQueries({ queryKey: ["users"] });

	const authUser = queryClient.getQueryData<User>(["auth-user"]);

	if (authUser?.id == data.id) {
		queryClient.setQueryData(["auth-user"], () => data);
	}
}

function onError(error: Error) {
	if (axios.isAxiosError(error)) return error.response?.data;

	return error.message;
}
