"use client";

import StatsChart from "@/app/component/common/charts/StatsChart";
import StatsTable from "@/app/component/common/tables/StatsTable";
import DashboardHead from "@/app/component/dashboard/DashboardHead";
import DashboardStats from "@/app/component/dashboard/DashboardStats";
import { useFetchJobs } from "@/hooks/queries/useFetchJobs";
import React, { useState } from "react";

const Dashboard = () => {
	const [search, setSearch] = useState<string>();

	const { data } = useFetchJobs({ search });

	return (
		<>
			<DashboardHead
				name="Dashboard"
				search={search}
				setSearch={setSearch}
				results={data}
			/>
			<DashboardStats />
			<div className="w-full px-4 sm:px-8 mb-5">
				<StatsChart />
			</div>
			<StatsTable />
		</>
	);
};

export default Dashboard;
