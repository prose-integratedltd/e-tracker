import { instance } from "../api";

export interface User {
	id: string;
	uId: string;
	username: string;
	email: string;
	fullname: string;
	phoneNumber: string;
	department: {
		id: string;
		name: string;
	};
	operationLocation: {
		id: string;
		name: string;
	};
	roles: string[];
	suspended: boolean;
	updatedAt: string | null;
	createdAt: string;
}

export const getUser = async (id: string): Promise<User> => {
	const response = await instance.get(`/users/${id}`);
	return response.data;
};
