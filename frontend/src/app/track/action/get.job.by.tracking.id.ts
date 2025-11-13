import { JobModel } from "@/hooks/queries/useFetchJobDetails";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const getJobByTrackingId = async (jId: string) => {
	const response = await fetch(`${baseURL}/jobs/track/${jId}`);
	const data = await response.json();

	return data as JobModel;
};
