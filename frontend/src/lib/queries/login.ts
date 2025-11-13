import { instance } from "../api";

export interface LoginPayload {
	email: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
}

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
	const response = await instance.post<LoginResponse>("/users/signin", data);
	return response.data;
};
