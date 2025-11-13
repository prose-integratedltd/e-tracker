"use client";

import React from "react";
import DashboardStatCard from "./DashboardStatCard";
import {
	ActiveJobsIcon,
	CancelledJobsIcon,
	CompletedJobsIcon,
	TotalJobsIcon,
} from "../common/DashboardStatsIcons";
import { useFetchStats } from "@/hooks/queries/useFetchStats";
// import ReactLoading from "react-loading";

const DashboardStats = () => {
	const { data } = useFetchStats();

	return (
		<div className="px-4 sm:px-10 py-7 w-full flex flex-wrap gap-3 sm:gap-7 justify-center">
			<DashboardStatCard
				title="Total Jobs"
				number={data?.totalJobs || "0"}
				background="#19469D0F"
				color="#19469D"
				icon={TotalJobsIcon}
				searchKey={""}
			/>
			<DashboardStatCard
				title="Completed Jobs"
				number={data?.completedJobs || "0"}
				background="#D1F0F1"
				color="#09B0B5"
				icon={CompletedJobsIcon}
				searchKey={"Completed"}
			/>
			<DashboardStatCard
				title="Active Jobs"
				number={data?.activeJobs || "0"}
				background="#FBEEDE"
				color="#DE7800"
				icon={ActiveJobsIcon}
				searchKey={"Open"}
			/>
			<DashboardStatCard
				title="Cancelled Jobs"
				number={data?.cancelledJobs || "0"}
				background="#FF30301F"
				color="#FF3030"
				icon={CancelledJobsIcon}
				searchKey={"Cancelled"}
			/>
			{/* <DashboardStatCard
				title="Total Bids Submitted"
				number="600"
				background="#1E1E1E"
				color="#1E1E1E"
				icon={BidsSubmittedIcon}
			/>
			<DashboardStatCard
				title="Total Bids Won"
				number="600"
				background="#03CA84"
				color="#1E1E1E"
				icon={BidsWonIcon}
			/>
			<DashboardStatCard
				title="Unanswered Bids"
				number="600"
				background="#FF6C6C"
				color="#1E1E1E"
				icon={BidsUnansweredIcon}
			/> */}
		</div>
	);
};

export default DashboardStats;
