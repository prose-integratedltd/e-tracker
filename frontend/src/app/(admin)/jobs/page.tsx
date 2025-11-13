"use client";

import JobFilterModal from "@/app/component/common/modals/JobFilterModal";
import DashboardHead from "@/app/component/dashboard/DashboardHead";
import JobsTable from "@/app/component/common/tables/JobsTable";
import React, { useState } from "react";

const Jobs = () => {
	const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [progress, setProgress] = useState<number>(0);
	const [status, setStatus] = useState<string>("");

	return (
		<>
			<DashboardHead name="Jobs" />

			<JobsTable
				setShowFilterModal={setShowFilterModal}
				filters={{ searchTerm, progress, status }}
			/>

			{showFilterModal && (
				<JobFilterModal
					setShowFilterModal={setShowFilterModal}
					setSearchTerm={setSearchTerm}
					setProgress={setProgress}
					setStatus={setStatus}
					filters={{ searchTerm, progress, status }}
				/>
			)}
		</>
	);
};

export default Jobs;
