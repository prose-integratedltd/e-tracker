"use client";

import { useFetchMailTemplates } from "@/hooks/queries/useFetchMailTemplates";
import { formatDate } from "@/lib/functions/formatDate";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
// import ReactLoading from "react-loading";
import Pagination from "../pagination/Pagination";
import useAuth from "@/lib/useAuth";
import TemplateDeleteModal from "../modals/TemplateDeleteModal";
import { useDeleteTemplate } from "@/hooks/mutations/useDeleteTemplate";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";

// type Templates = {
//   templateTitle: string;
//   templateType: string;
//   dateCreated: string;
// };
type TemplatesTableProps = {
	setShowAddTemplate: (show: boolean) => void;
};

const MailTemplateTable: React.FC<TemplatesTableProps> = ({
	setShowAddTemplate,
}) => {
	// const templates: Templates[] = Array(5).fill({
	//   templateTitle: "Package Tracking Details",
	//   templateType: "Email",
	//   dateCreated: "18-11-2024",
	// });

	const router = useRouter();
	const { isAdmin } = useAuth();
	const { showToast } = useToast();
	const [page, setPage] = useState(1);
	const queryClient = useQueryClient();
	const { mutate, isPending } = useDeleteTemplate();
	const [deletable, setDeletable] = useState<string>();
	const [searchTerm, setSearchTerm] = useState<string>("");

	const queryParams = { page, search: searchTerm };

	const { data, isLoading } = useFetchMailTemplates(queryParams);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value.toLowerCase());
	};

	const handleDelete = () => {
		if (!deletable) return;

		mutate(deletable, {
			onSuccess: () => {
				setDeletable(undefined);
				showToast("Template Deleted Successfully", "success");
				queryClient.invalidateQueries({
					queryKey: ["mail-templates", queryParams],
				});
			},
		});
	};

	return (
		<>
			<div className="w-full p-4 sm:p-7">
				<div className="w-full  bg-white rounded-[16px] shadow-md p-5">
					<div className="flex w-full gap-4 justify-between items-center mb-4">
						<div className="flex items-center w-[70%] sm:w-[330px] h-11 rounded-[10px] border border-[#CCCCCC] gap-3 px-3">
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
								value={searchTerm}
								onChange={handleSearchChange}
								placeholder="Search"
							/>
						</div>
						<button
							onClick={() => setShowAddTemplate(true)}
							className="flex items-center justify-center w-[30%] sm:w-[140px] h-11 bg-gradient-to-r from-[#19469D] to-[#09B0B5] text-white rounded-[10px]  transition text-sm sm:text-base"
						>
							<FaPlus className="mr-2" />
							<p className="hidden sm:block pr-1">Create</p> New
						</button>
					</div>

					<div className="overflow-x-auto scrollbar-hide rounded-t-[10px]">
						<table className="w-full text-left rounded-t-[10px] border-collapse border border-dashed border-gray-200 whitespace-nowrap">
							<thead className="rounded-t-[10px]">
								<tr className="bg-gray-800 text-white rounded-t-[10px]">
									<th className="p-4">Template Title</th>
									<th className="p-4">Template Type</th>
									<th className="p-4">Date Created</th>

									{isAdmin && <th className="p-4"></th>}
								</tr>
							</thead>
							<tbody>
								{isLoading ? (
									<tr>
										<td
											colSpan={7}
											className="p-4 text-center text-xl"
										>
											{/* <ReactLoading type="bars" color="#000" /> */}
											Loading...
										</td>
									</tr>
								) : data?.data?.length !== 0 ? (
									data?.data?.map((data) => (
										<tr
											key={data?.id}
											className="border-b border-dashed border-gray-200 hover:bg-gray-100 cursor-pointer"
											onClick={() => {
												router.push(
													`/email-template/${data?.id}`
												);
											}}
										>
											<td className="p-4 text-[#357AFF]">
												{data?.title}
											</td>
											<td className="p-4">
												{data?.type}
											</td>
											<td className="p-4">
												{formatDate(data?.createdAt)}
											</td>

											{isAdmin && (
												<td className="p-4 text-center">
													<button
														onClick={(e) => {
															e.stopPropagation();
															setDeletable(
																data?.id
															);
														}}
														className="hover:text-red-700 cursor-pointer"
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
																stroke="#FF3030"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</button>
												</td>
											)}
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={7}
											className="p-4 text-center"
										>
											No template found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{data?.data?.length !== 0 && (
				<Pagination
					currentPage={page}
					totalPages={data?.totalPages}
					onPageChange={(newPage) => setPage(newPage)}
					length={data?.data?.length}
				/>
			)}

			{deletable && (
				<TemplateDeleteModal
					setShowModal={() => setDeletable(undefined)}
					handleDelete={handleDelete}
					isPending={isPending}
				/>
			)}
		</>
	);
};

export default MailTemplateTable;
