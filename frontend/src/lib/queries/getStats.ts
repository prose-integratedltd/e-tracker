import { instance } from "../api";

type ChartData = {
	[year: string]: {
		[month: string]: {
			startDate: Date;
			endDate: Date;
			count: number;
		};
	};
};

type Stat = {
	totalJobs: number;
	completedJobs: number;
	activeJobs: number;
	cancelledJobs: number;
	chart: ChartData;
};

export const getStats = async (): Promise<Stat> => {
	const response = await instance.get("/statistics");
	return response.data;
};
