import { JobModel } from "@/hooks/queries/useFetchJobDetails";
import { instance } from "../api";
import qs from "qs";

export type Data = {
	data: JobModel[];
	totalPages: number;
};

type GetJobsParams = {
	search?: string;
	progress?: number;
	status?: string;
	page?: number;
	limit?: number;
};

export const getJobs = async (params?: GetJobsParams): Promise<Data> => {
	const filteredParams = Object.fromEntries(
		Object.entries(params || {}).filter(
			([, value]) => value !== undefined && value !== null && value !== ""
		)
	);

	const queryString = qs.stringify(filteredParams, { encode: true });

	const response = await instance.get(
		queryString ? `/jobs?${queryString}` : "/jobs"
	);
	return response.data;
};