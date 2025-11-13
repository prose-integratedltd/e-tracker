import { instance } from "../api";

export const deleteJob = async (id: string): Promise<void> => {
	const response = await instance.delete(`/jobs/${id}`);
	return response.data;
};
