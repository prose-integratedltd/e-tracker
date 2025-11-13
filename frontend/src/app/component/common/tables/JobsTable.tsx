"use client";

import DateRangePicker, { DateRangePickerProps } from "../../DateRangePicker";
import { getStatusClass, statusTitle } from "@/lib/functions/getStatusClass";
import { useDeleteJob } from "@/hooks/mutations/useDeleteJob";
import { useFetchJobs } from "@/hooks/queries/useFetchJobs";
import { truncateText } from "@/lib/functions/truncateText";
import { useQueryClient } from "@tanstack/react-query";
import JobActionModal from "../modals/JobActionModal";
import BackIconButton from "../../icons/back.icon";
import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import Pagination from "../pagination/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import ArrowDownIcon from "../../icons/arrow.down.icon";

type JobsTableProps = {
	setShowFilterModal: (showFilterModal: boolean) => void;
	filters: { searchTerm: string; progress: number; status: string };
};

type QueryParam = {
	name: string;
	value: string;
};

const JobsTable: React.FC<JobsTableProps> = ({
	setShowFilterModal,
	filters,
}) => {
	const router = useRouter();
	const params = useSearchParams();
	const [deletable, setDeletable] = useState<string>();
	const [searchTerm, setSearchTerm] = useState("");
	const { mutate, isPending } = useDeleteJob();
	const queryClient = useQueryClient();
	const { showToast } = useToast();
	const [page, setPage] = useState(1);
	const startDate = params.get("startDate");
	const endDate = params.get("endDate");
	const sortOrder = params.get("sortOrder");
	const sortBy = params.get("sortBy");
	const status = params.get("status");
	const queryParams = {
		page,
		search: searchTerm || filters.searchTerm,
		...(filters?.status && { status: filters.status }),
		...(status && { status: status }),
		...(filters?.progress >= 1 && { progress: filters.progress }),
		...(startDate && endDate && { startDate, endDate }),
		...(sortBy && sortOrder && { sortBy, sortOrder }),
	};
	const { data: jobs, isLoading: isLoadingJobs } = useFetchJobs(queryParams);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value.toLowerCase());
	};

	const [dataRange, setDataRange] = useState<DateRangePickerProps | null>(
		null
	);

	const createQueryString = useCallback(
		(items: QueryParam[]) => {
			const $params = new URLSearchParams(params.toString());

			items.forEach((item) => $params.set(item.name, item.value));

			return $params.toString();
		},
		[params]
	);

	useEffect(() => {
		const startDate = params.get("startDate");
		const endDate = params.get("endDate");

		if (!startDate || !endDate) return;

		setDataRange({
			startDate: new Date(startDate),
			endDate: new Date(endDate),
		});
	}, [params]);

	const handleDelete = () => {
		if (!deletable) return;

		mutate(deletable, {
			onSuccess: () => {
				showToast("Job Deleted Successfully", "success");

				setDeletable(undefined);
				queryClient.invalidateQueries({
					queryKey: ["jobs", queryParams],
				});
			},
			onError: (error) => showToast(error.message, "error"),
		});
	};

	function sortByStatus(): void {
		const newSortOrder = sortOrder === "desc" ? "asc" : "desc";

		const query = createQueryString([
			{ name: "sortBy", value: "status" },
			{ name: "sortOrder", value: newSortOrder },
		]);

		router.push(`/jobs?${query}`);
	}

	return (
		<>
			<div className="w-full p-4 sm:p-7">
				<div className="flex items-center gap-3 mb-3">
					<BackIconButton />

					<span className="text-[#1D1D1D] font-poppins font-semibold">
						{status === ""
							? "All jobs"
							: status === "Completed"
							? "Completed jobs"
							: status === "Open"
							? "Active jobs"
							: status === "Cancelled"
							? "Cancelled jobs"
							: "All jobs"}
					</span>
				</div>
				<div className="w-full bg-white rounded-[16px] shadow-md p-5">
					<div className="flex flex-col sm:flex-row w-full gap-4 justify-between sm:items-center mb-4">
						<div className="flex gap-4 flex-col lg:flex-row">
							<div className="flex items-center w-full sm:w-[330px] h-11 rounded-[10px] border border-[#CCCCCC] gap-3 px-3">
								<div>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
											stroke="#3D3D3D"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>

								<input
									type="text"
									className="w-full h-full bg-transparent outline-none text-lg text-[#979797] placeholder:text-[#979797]"
									placeholder="Search"
									value={searchTerm}
									onChange={handleSearchChange}
								/>
							</div>

							{dataRange && (
								<DateRangePicker
									startDate={dataRange.startDate}
									endDate={dataRange.endDate}
									onChange={(value) => {
										if (!value[0].key) return;
										router.replace(
											`/jobs?startDate=${value[0].startDate?.toDateString()}&endDate=${value[0].endDate?.toDateString()}`
										);
									}}
								/>
							)}
						</div>

						<div className="flex items-center justify-between sm:justify-start gap-3">
							<button
								className="w-[107px] h-11 rounded-[10px] border border-[#CCCCCC] px-[15px] flex items-center gap-[6px]"
								onClick={() => setShowFilterModal(true)}
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M6 12H18M3 6H21M9 18H15"
										stroke="#1D1D1D"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span className="text-[#1D1D1D] font-poppins">
									Filters
								</span>
							</button>
							<Link
								href="/jobs/add"
								className="flex items-center justify-center w-[30%] sm:w-[140px] h-11 bg-gradient-to-r from-[#19469D] to-[#09B0B5] text-white rounded-[10px] transition text-sm sm:text-base"
							>
								<FaPlus className="mr-2" /> Add New
							</Link>
						</div>
					</div>

					<div className="overflow-x-auto scrollbar-hide">
						<table className="w-full text-left border-collapse border border-dashed border-gray-200 whitespace-nowrap">
							<thead>
								<tr className="bg-gray-800 text-white">
									<th className="p-4">Job ID</th>
									<th className="p-4">Description</th>
									<th
										className="p-4 flex items-center gap-2 cursor-pointer"
										onClick={sortByStatus}
									>
										Status <ArrowDownIcon />
									</th>
									<th className="p-4">Client Name</th>
									<th className="p-4">Job Type</th>
									<th className="p-4">Progress</th>
									<th className="p-4"></th>
								</tr>
							</thead>
							<tbody>
								{isLoadingJobs ? (
									<tr>
										<td
											colSpan={7}
											className="p-4 text-center text-xl"
										>
											{/* <ReactLoading type="bars" color="#000" /> */}
											Loading...
										</td>
									</tr>
								) : Array.isArray(jobs?.data) ? (
									(jobs?.data ?? []).map((job, index) => (
										<tr
											key={index}
											className="border-b border-dashed border-gray-200 hover:bg-gray-100 cursor-pointer"
										>
											<td className="text-blue-600 underline cursor-pointer">
												<Link
													href={`/jobs/edit/${job?.id}`}
													className="p-4 block"
												>
													{`${job?.jId.slice(
														0,
														6
													)}...`}
												</Link>
											</td>
											<td>
												<Link
													href={`/jobs/edit/${job?.id}`}
													className="p-4 block"
												>
													{truncateText(
														job?.description,
														4
													)}
												</Link>
											</td>
											<td>
												<Link
													href={`/jobs/edit/${job?.id}`}
													className={`${getStatusClass(
														job.status
													)} text-sm rounded-full px-3 py-1 block`}
												>
													{statusTitle(job?.status)}
												</Link>
											</td>
											<td>
												<Link
													className="p-4 block"
													href={`/jobs/edit/${job?.id}`}
												>
													{job?.clientName}
												</Link>
											</td>
											<td>
												<Link
													className="p-4"
													href={`/jobs/edit/${job?.id}`}
												>
													{job.type.name}
												</Link>
											</td>
											<td className="border-b whitespace-nowrap">
												<Link
													href={`/jobs/edit/${job?.id}`}
													className="flex items-center gap-2 p-4"
												>
													<div className="w-full bg-gray-200 rounded-full h-2">
														<div
															className={`h-2 rounded-full bg-[#1DAEFF]`}
															style={{
																width: `${job?.progress}%`,
															}}
														></div>
													</div>
													<span className="text-[#3D3D3D] text-sm">
														{job?.progress}%
													</span>
												</Link>
											</td>
											<td className="p-4 text-center">
												<button
													onClick={(e) => {
														e.stopPropagation();
														setDeletable(job.id);
													}}
													className="hover:text-red-700"
												>
													<svg
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M9 3H15M3 6H21M19 6L18.2987 16.5193C18.1935 18.0975 18.1409 18.8867 17.8 19.485C17.4999 20.0118 17.0472 20.4353 16.5017 20.6997C15.882 21 15.0911 21 13.5093 21H10.4907C8.90891 21 8.11803 21 7.49834 20.6997C6.95276 20.4353 6.50009 20.0118 6.19998 19.485C5.85911 18.8867 5.8065 18.0975 5.70129 16.5193L5 6M10 10.5V15.5M14 10.5V15.5"
															stroke="#3D3D3D"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={7}
											className="p-4 text-center"
										>
											No jobs found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>{" "}
			{jobs?.data?.length !== 0 && (
				<Pagination
					currentPage={page}
					totalPages={jobs?.totalPages}
					onPageChange={(newPage) => setPage(newPage)}
					length={jobs?.data?.length}
				/>
			)}
			{deletable && (
				<JobActionModal
					onClosed={() => setDeletable(undefined)}
					handleDelete={handleDelete}
					isPending={isPending}
				/>
			)}
		</>
	);
};

export default JobsTable;
