import { JobModel } from "@/hooks/queries/useFetchJobDetails";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const getJobByTrackingId = async (jId: string) => {
	if (!baseURL) {
		throw new Error("NEXT_PUBLIC_API_URL is not configured");
	}

	const url = `${baseURL}/jobs/track/${jId}/`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch job: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	return data as JobModel;
};
