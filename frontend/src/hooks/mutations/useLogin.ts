import { useMutation } from "@tanstack/react-query";
import { LoginPayload, LoginResponse, login } from "@/lib/queries/login";

export const useLogin = () =>
	useMutation<LoginResponse, Error, LoginPayload>({
		mutationFn: login,
		onSuccess: (data) => {
			localStorage.setItem("token", data.accessToken);

			window.dispatchEvent(new Event("storage"));
		},
	});
