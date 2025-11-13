import { instance } from "../api";
import { User } from "./getUser";

export interface UpdateUserPayload {
	profilePicture?: string | null;
	username?: string | null;
	email?: string | null;
	fullname?: string | null;
	phoneNumber?: string | null;
	departmentId?: string | null;
	operationLocationId?: string | null;
	roles?: string[] | null;
	suspended?: boolean | null;
	password?: string | null;
}

export const updateUser = async (
	id: string,
	data: UpdateUserPayload
): Promise<User> => {
	const response = await instance.patch<User>(`/users/${id}`, data);
	return response.data;
};

export const updateAuthUser = async ({
	payload,
}: {
	payload: UpdateUserPayload;
}): Promise<User> => {
	const response = await instance.patch<User>(`/auth/user`, payload);
	return response.data;
};
