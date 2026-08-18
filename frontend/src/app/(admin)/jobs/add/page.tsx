"use client";

import DashboardHead from "@/app/component/dashboard/DashboardHead";
import { useJobTypes } from "@/hooks/queries/useFetchJobTypes";
import BackIconButton from "@/app/component/icons/back.icon";
import JobTypeCard from "@/app/component/job/JobTypeCard";

const AddJobPage = () => {
	const { data: types } = useJobTypes();

	return (
		<main className="flex flex-col h-[100vh] bg-white font-poppins">
			<DashboardHead name="Jobs" />

			<div className="flex items-center gap-3 w-full px-4 py-2 sm:px-7 sm:py-4 bg-[#f0f0f0] border-b border-[#CCCCCC]">
				<BackIconButton />

				<span className="text-[#1D1D1D] font-semibold">
					Select Job Type
				</span>
			</div>

			<div className="p-4 sm:p-7 flex flex-wrap items-stretch gap-6">
				{(types ?? []).map((type) => (
					<JobTypeCard key={type.id} type={type} />
				))}
			</div>
		</main>
	);
};

export default AddJobPage;
