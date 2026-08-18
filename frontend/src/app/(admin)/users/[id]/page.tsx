"use client";

import UserActionModal from "@/app/component/common/modals/UserActionModal";
import { useDeleteUser } from "@/hooks/mutations/useDeleteUser";
import { useFetchDepartments } from "@/hooks/queries/useFetchDepartments";
import { useFetchOperationLocations } from "@/hooks/queries/useFetchOperationLocations";
import { useFetchUserDetails } from "@/hooks/queries/useFetchUserDetails";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import ReactLoading from "react-loading";
import { useToast } from "@/context/ToastContext";
import { useUpdateUser } from "@/hooks/mutations/useUpdateUser";
import SuspendUserModal from "@/app/component/common/modals/SuspendUserModal";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/lib/queries/getUser";
import useAuth from "@/lib/useAuth";
import EyeIcon from "@/app/component/icons/eye.icon";
import { FaRegEyeSlash } from "react-icons/fa";

type CustomError = {
	response?: {
		data?: {
			message?: string;
		};
	};
};

interface Errors {
	phoneNumber: string;
}

interface FormData {
	// username: string;
	// email: string;
	fullname: string;
	phoneNumber: string;
	departmentId: string;
	operationLocationId: string;
	roles: string[];
	password: string;
	suspended?: boolean;
	profilePicture: string | null;
}

const UserRecord = () => {
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [passwordType, setPasswordType] = useState("password");
	const [showSuspendModal, setShowSuspendDeleteModal] =
		useState<boolean>(false);
	const router = useRouter();
	const queryClient = useQueryClient();
	const { logout, isAdmin } = useAuth();

	const { data: departments } = useFetchDepartments();
	const { data: operationLocations } = useFetchOperationLocations();
	const { showToast } = useToast();
	const { id: pageId } = useParams<{ id: string }>();
	const [disable, setDisable] = useState<boolean>(true);
	const [errors, setErrors] = useState<Errors>({
		phoneNumber: "",
	});

	const { data, isLoading } = useFetchUserDetails(pageId);
	const { mutate, isPending } = useDeleteUser();
	const {
		mutate: updateUser,
		isPending: isUpdating,
		isSuccess,
		error,
	} = useUpdateUser();

	const [formData, setFormData] = useState<FormData>({
		// username: "",
		// email: "",
		fullname: "",
		phoneNumber: "",
		departmentId: "",
		operationLocationId: "",
		roles: ["user"],
		password: "",
		profilePicture: "",
	});

	useEffect(() => {
		if (isSuccess) {
			setShowSuspendDeleteModal(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess]);

	useEffect(() => {
		if (error) {
			showToast(error.message, "error");
			// setShowSuspendDeleteModal(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error]);

	useEffect(() => {
		if (data) {
			setFormData({
				// username: data?.username || "",
				// email: data?.email || "",
				fullname: data?.fullname || "",
				phoneNumber: data?.phoneNumber || "",
				departmentId: data?.department?.id || "",
				operationLocationId: data?.operationLocation?.id || "",
				roles:
					Array.isArray(data?.roles) && data?.roles.length > 0
						? data.roles
						: ["user"],
				password: "",
				profilePicture: null,
			});
		}
	}, [data]);

	const isCustomError = (error: unknown): error is CustomError => {
		return (
			typeof error === "object" &&
			error !== null &&
			"response" in error &&
			typeof (error as CustomError).response === "object"
		);
	};

	const handleDelete = () => {
		mutate(pageId, {
			onSuccess: () => {
				showToast("User Deleted Successfully", "success");
				router.push("/users");
			},
			onError: (error: unknown) => {
				if (isCustomError(error)) {
					const message =
						error.response?.data?.message || "Error deleting user";
					console.error("Failed to delete user:", error);
					showToast(message, "error");
				} else {
					console.error("Unexpected error:", error);
					showToast("An unexpected error occurred", "error");
				}
			},
		});
	};

	const onSuspended = () => {
		updateUser(
			{ userId: pageId, data: { suspended: !data?.suspended } },
			{
				onSuccess: (data) => {
					const authUser = queryClient.getQueryData<User>([
						"auth-user",
					]);

					if (
						authUser?.id == data.id &&
						data.roles.includes("admin")
					) {
						logout().then(() => router.push("/login"));
					}

					if (data) {
						showToast("User unsuspended Successfully", "success");
					} else {
						showToast("User suspended Successfully", "success");
					}
				},
			}
		);
	};

	const isSwitchOn = formData.roles.includes("admin");

	const toggleSwitch = () => {
		setFormData((prevFormData) => ({
			...prevFormData,
			roles: isSwitchOn ? ["user"] : ["admin"],
		}));
		setDisable(false);
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;

		if (name === "phoneNumber") {
			const onlyNumbers = value.replace(/[^0-9]/g, "");
			if (onlyNumbers.length > 11) {
				setErrors((prev) => ({
					...prev,
					phoneNumber: "Phone number cannot exceed 11 digits.",
				}));
			} else if (onlyNumbers.length < 11) {
				setErrors((prev) => ({
					...prev,
					phoneNumber: "Phone number must be exactly 11 digits.",
				}));
			} else {
				setErrors((prev) => ({
					...prev,
					phoneNumber: "",
				}));
			}
			setFormData((prev) => ({
				...prev,
				phoneNumber: onlyNumbers,
			}));
			setDisable(false);

			return;
		}

		setFormData((prev) => ({ ...prev, [name]: value }));
		setDisable(false);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		updateUser(
			{
				userId: pageId || "",
				data: formData,
			},
			{
				onSuccess: () => {
					showToast("User Updated Successfully", "success");
				},
				onError: (error: unknown) => {
					if (isCustomError(error)) {
						const message =
							error.response?.data?.message ||
							"Error updating user";
						console.error("Failed to update user:", error);
						showToast(message, "error");
					} else {
						console.error("Unexpected error:", error);
						showToast("An unexpected error occurred", "error");
					}
				},
			}
		);
	};

	return (
		<>
			{isLoading ? (
				<div className="flex items-center justify-center w-full h-full text-xl">
					{/* <ReactLoading type="bars" color="#000" /> */}
					Loading...
				</div>
			) : (
				<div className="p-4 sm:p-7 w-full">
					<div className="w-full px-4 sm:px-24 py-7 bg-white rounded-[16px] relative md:h-[90vh] overflow-y-auto pb-8">
						<button
							className="w-[45px] h-[45px] bg-[#F4F4F4] rounded-full flex items-center justify-center absolute sm:left-7 left-4 sm:top-7 top-4"
							onClick={() => {
								router.push(`/users`);
							}}
						>
							{" "}
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M19 12L5 12M5 12L12 19M5 12L12 5"
									stroke="#1D1D1D"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>

						<form className="w-full" onSubmit={handleSubmit}>
							<div className="flex items-center justify-between w-full">
								<h3 className="text-[#1D1D1D] text-[22px] font-semibold text-center sm:text-left">
									User Record
								</h3>

								<div className="flex gap-3">
									{!isAdmin && (
										<button
											type="button"
											className="w-[141px] h-[54px] rounded-[10px] bg-[#FFB8021C] font-medium text-[#FF8D24]"
											onClick={() => {
												setShowSuspendDeleteModal(true);
											}}
										>
											{data?.suspended
												? "Unsuspend"
												: "Suspend"}
										</button>
									)}
									<button
										type="button"
										className="w-[141px] h-[54px] rounded-[10px] bg-[#FFDFDF] font-medium text-[#FF3030]"
										onClick={() => setShowDeleteModal(true)}
									>
										Delete
									</button>
								</div>
							</div>

							<div className="sm:flex justify-between mt-3">
								<div>
									<div className="flex flex-col gap-2 mt-5">
										<label
											htmlFor=""
											className="text-[#6C757D] font-medium text-sm"
										>
											User ID
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px]">
											<input
												type="text"
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D] disabled:bg-[#f8f8f8] p-4"
												placeholder="#100232"
												value={data?.uId}
												disabled
											/>
										</div>
									</div>

									<div className="flex flex-col gap-2 mt-5">
										<label
											htmlFor="Username"
											className="text-[#6C757D] font-medium text-sm"
										>
											Username*
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
											<input
												type="text"
												name="username"
												value={data?.username}
												onChange={handleChange}
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												disabled
											/>
										</div>
									</div>

									<div className="flex flex-col gap-2 mt-5">
										<label
											htmlFor="Full name"
											className="text-[#6C757D] font-medium text-sm"
										>
											Full name*
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
											<input
												type="text"
												name="fullname"
												value={formData?.fullname}
												onChange={handleChange}
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
											/>
										</div>
									</div>

									<div className="flex flex-col gap-2 mt-5">
										<label
											htmlFor="Department"
											className="text-[#6C757D] font-medium text-sm"
										>
											Department*
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
											<select
												id=""
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												name="departmentId"
												value={formData?.departmentId}
												onChange={(e) => {
													setFormData(
														(prevValues) => ({
															...prevValues,
															departmentId:
																e.target.value,
														})
													);
													setDisable(false);
												}}
											>
												{" "}
												{departments?.map(
													(department) => (
														<option
															key={department?.id}
															value={
																department?.id
															}
														>
															{department?.name}
														</option>
													)
												)}
											</select>
										</div>
									</div>
								</div>

								<div>
									<div className="flex flex-col gap-2 mt-5">
										<label
											htmlFor="Email"
											className="text-[#6C757D] font-medium text-sm"
										>
											Email*
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
											<input
												type="email"
												name="email"
												value={data?.email}
												onChange={handleChange}
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												placeholder=""
												disabled
											/>
										</div>
									</div>

									<div className="flex flex-col gap-2 mt-5 relative">
										<label
											htmlFor=""
											className="text-[#6C757D] font-medium text-sm"
										>
											Phone Number (optional)
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
											<input
												type="text"
												name="phoneNumber"
												value={formData?.phoneNumber}
												onChange={handleChange}
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
											/>
										</div>
										{errors.phoneNumber && (
											<span className="text-red-500 text-[12px] absolute -bottom-4 left-0">
												{errors.phoneNumber}
											</span>
										)}
									</div>

									<div className="flex flex-col gap-2 mt-5">
										<label
											htmlFor="Password"
											className="text-[#6C757D] font-medium text-sm"
										>
											Password*
										</label>
										<div className="flex gap-2 sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
											<input
												type={passwordType}
												name="password"
												value={formData?.password}
												onChange={handleChange}
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
											/>

											<span className="hover:cursor-pointer text-2xl font-medium">
												{passwordType === "password" ? (
													<EyeIcon
														onClick={() => {
															setPasswordType(
																"text"
															);
														}}
													/>
												) : (
													<FaRegEyeSlash
														onClick={() => {
															setPasswordType(
																"password"
															);
														}}
													/>
												)}
											</span>
										</div>
									</div>

									<div className="flex flex-col gap-2 mt-5">
										<label
											htmlFor="Operation Location"
											className="text-[#6C757D] font-medium text-sm"
										>
											Operation Location*
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
											<select
												id=""
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												name="operationLocationId"
												value={
													formData?.operationLocationId
												}
												onChange={(e) => {
													setFormData(
														(prevValues) => ({
															...prevValues,
															operationLocationId:
																e.target.value,
														})
													);
													setDisable(false);
												}}
											>
												{operationLocations?.map(
													(operationLocation) => (
														<option
															key={
																operationLocation?.id
															}
															value={
																operationLocation?.id
															}
														>
															{
																operationLocation?.name
															}
														</option>
													)
												)}
											</select>
										</div>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between w-full sm:w-[400px] mt-14">
								<div>
									<h3 className="text-[#1D1D1D] font-semibold">
										Admin Access
									</h3>
									<span className="text-[#1D1D1D] text-sm">
										Grant this User administrator&apos;s
										role
									</span>
								</div>
								<button
									type="button"
									onClick={toggleSwitch}
									className={`relative inline-flex items-center h-8 rounded-full w-[60px] transition-all border-[#C2CBCD] ${
										isSwitchOn
											? "bg-[#19469D]"
											: "bg-[#F3F3F3]"
									}`}
								>
									<span
										className={`inline-block w-7 h-7 transform bg-white rounded-full transition-transform ${
											isSwitchOn
												? "translate-x-7"
												: "translate-x-1"
										}`}
									/>
								</button>
							</div>

							<button
								className="bg-[#1E1E1E] w-full sm:w-[400px] h-[54px] rounded-[10px] text-white font-semibold mt-14 disabled:bg-[#F4F4F4] disabled:text-[#3D3D3D] disabled:pointer-events-none"
								disabled={disable || isUpdating}
							>
								{isUpdating ? "Loading..." : "Save"}
							</button>
						</form>
					</div>
					{showDeleteModal && (
						<UserActionModal
							setShowModal={setShowDeleteModal}
							handleDelete={handleDelete}
							isPending={isPending}
						/>
					)}

					{showSuspendModal && (
						<SuspendUserModal
							onClosed={() => setShowSuspendDeleteModal(false)}
							suspended={data?.suspended}
							onSuspended={onSuspended}
							isPending={isUpdating}
						/>
					)}
				</div>
			)}
		</>
	);
};

export default UserRecord;
