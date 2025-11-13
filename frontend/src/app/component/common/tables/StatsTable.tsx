"use client";

import { useFetchJobs } from "@/hooks/queries/useFetchJobs";
import { formatDate } from "@/lib/functions/formatDate";
import { getStatusClass, statusTitle } from "@/lib/functions/getStatusClass";
import JobActionModal from "../modals/JobActionModal";
import { useState } from "react";
import { useDeleteJob } from "@/hooks/mutations/useDeleteJob";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import { truncateText } from "@/lib/functions/truncateText";

const StatsTable = () => {
	const [deletable, setDeletable] = useState<string>();
	const { mutate, isPending } = useDeleteJob();
	const queryClient = useQueryClient();
	const { showToast } = useToast();

	const queryParams = { limit: 4, sortBy: "createdAt", sortOrder: "desc" };

	const { data, isLoading: isLoadingJobs } = useFetchJobs(queryParams);
	const jobs = data || { data: [] };

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
		});
	};

	return (
		<>
			<div className="p-4 pt-4 md:pt-0 sm:p-6">
				<div className="w-full bg-white rounded-[16px] p-5">
					<h2 className="text-2xl font-bold mb-4">Latest Jobs</h2>
					<div className="overflow-x-auto scrollbar-hide">
						<table className="w-full min-w-[800px] border-collapse">
							<thead>
								<tr>
									<th className="border-b p-4 text-left bg-gray-100 whitespace-nowrap">
										Date
									</th>
									<th className="border-b p-4 text-left bg-gray-100 whitespace-nowrap">
										Job ID
									</th>
									<th className="border-b p-4 text-left bg-gray-100 whitespace-nowrap">
										Client Name
									</th>
									<th className="border-b p-4 text-left bg-gray-100 whitespace-nowrap">
										Description
									</th>
									<th className="border-b p-4 text-left bg-gray-100 whitespace-nowrap">
										Status
									</th>
									<th className="border-b p-4 text-left bg-gray-100 whitespace-nowrap">
										Category
									</th>
									<th className="border-b p-4 text-left bg-gray-100 whitespace-nowrap">
										Progress
									</th>
									<th className="border-b p-4 text-left bg-gray-100 whitespace-nowrap">
										Action
									</th>
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
								) : Array.isArray(jobs?.data) &&
								  jobs?.data?.length > 0 ? (
									(jobs?.data ?? []).map((job, index) => (
										<tr
											key={index}
											className="border-b border-dashed border-gray-200 hover:bg-gray-100 cursor-pointer"
										>
											<td className="text-sm">
												<Link
													className="text-sm p-4 block"
													href={`/jobs/edit/${job?.id}`}
												>
													{formatDate(job.date!)}
												</Link>
											</td>
											<td className=" text-blue-600 underline cursor-pointer text-sm">
												<Link
													className="text-sm p-4 block"
													href={`/jobs/edit/${job?.id}`}
												>
													{`${job?.jId.slice(
														0,
														6
													)}...`}
												</Link>
											</td>
											<td>
												<Link
													className="text-sm p-4 block"
													href={`/jobs/edit/${job?.id}`}
												>
													{job?.clientName}
												</Link>
											</td>

											<td>
												<Link
													className="text-sm p-4 block"
													href={`/jobs/edit/${job?.id}`}
												>
													{truncateText(
														job?.description,
														3
													)}
												</Link>
											</td>
											<td className={`p-4  `}>
												<Link
													href={`/jobs/edit/${job?.id}`}
													className={`${getStatusClass(
														job.status
													)} text-sm rounded-full px-3 py-1 block`}
												>
													{statusTitle(job.status)}
												</Link>
											</td>
											<td>
												<Link
													href={`/jobs/edit/${job?.id}`}
													className="text-sm p-4 block"
												>
													{job?.type?.name}
												</Link>
											</td>

											<td className="border-b p-4 whitespace-nowrap">
												<Link
													href={`/jobs/edit/${job?.id}`}
													className="flex items-center gap-2"
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
			</div>

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

export default StatsTable;
