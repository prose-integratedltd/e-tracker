"use client";

import { useFetchUsers } from "@/hooks/queries/useFetchUsers";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
// import ReactLoading from "react-loading";
import Pagination from "../pagination/Pagination";

type UsersTableProps = {
	setShowCreateUser: (show: boolean) => void;
};

const UsersTable: React.FC<UsersTableProps> = ({ setShowCreateUser }) => {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [page, setPage] = useState(1);
	const router = useRouter();
	const { data: users, isLoading: isLoadinUsers } = useFetchUsers({
		page,
		search: searchTerm,
	});

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value.toLowerCase());
	};

	return (
		<>
			<div className="w-full p-4 sm:p-7">
				<div className="w-full  bg-white rounded-[16px] shadow-md p-5">
					<div className="flex w-full gap-4 justify-between items-center mb-4">
						<div className="flex items-center w-[70%] sm:w-[330px] h-11 rounded-[10px] bg-[#EFEFEF] gap-3 px-3">
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
							onClick={() => setShowCreateUser(true)}
							className="flex items-center justify-center w-[30%] sm:w-[140px] h-11 bg-gradient-to-r from-[#19469D] to-[#09B0B5] text-white rounded-[10px]  transition text-sm sm:text-base"
						>
							<FaPlus className="mr-2" /> Add User
						</button>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse whitespace-nowrap">
							<thead>
								<tr className="bg-gray-800 text-white">
									<th className="p-4">User ID</th>
									<th className="p-4">Username</th>
									<th className="p-4">Full Name</th>
									<th className="p-4">Email</th>
									<th className="p-4">Phone Number</th>
									<th className="p-4">Actions</th>
								</tr>
							</thead>
							<tbody>
								{isLoadinUsers ? (
									<tr>
										<td
											colSpan={6}
											className="p-4 text-center text-xl"
										>
											{/* <ReactLoading type="bars" color="#000" /> */}
											Loading...
										</td>
									</tr>
								) : users?.data?.length !== 0 ? (
									users?.data?.map((user) => (
										<tr
											key={user?.id}
											className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
											onClick={() => {
												router.push(
													`/users/${user?.id}`
												);
											}}
										>
											<td className="p-4 text-[#1DAEFF] underline cursor-pointer">
												#{`${user?.uId.slice(0, 6)}...`}
											</td>
											<td className="p-4">
												{user?.username}
											</td>
											<td className="p-4">
												{user?.fullname}
											</td>
											<td className="p-4">
												{user?.email}
											</td>
											<td className="p-4">
												{user?.phoneNumber?.replace(
													/^234/,
													"0"
												)}
											</td>
											<td className="p-4 text-center">
												<button className="text-red-500 hover:text-red-700">
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
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={6}
											className="p-4 text-center"
										>
											No users found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{users?.data?.length !== 0 && (
				<Pagination
					currentPage={page}
					totalPages={users?.totalPages}
					onPageChange={(newPage) => setPage(newPage)}
					length={users?.data?.length}
				/>
			)}
		</>
	);
};

export default UsersTable;
