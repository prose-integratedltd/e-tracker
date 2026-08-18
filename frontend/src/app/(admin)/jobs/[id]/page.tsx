"use client";

import React, { useEffect, useState } from "react";
import JobActionModal from "@/app/component/common/modals/JobActionModal";
import { useDeleteJob } from "@/hooks/mutations/useDeleteJob";
import { useFetchJobTypes } from "@/hooks/queries/useFetchJobTypes";
import { useFetchJobDetails } from "@/hooks/queries/useFetchJobDetails";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import UpdateStatusModal from "@/app/component/common/modals/UpdateStatusModal";
import { useUpdateJob } from "@/hooks/mutations/useUpdateJob";
import DashboardHead from "@/app/component/dashboard/DashboardHead";
import BackIconButton from "@/app/component/icons/back.icon";

type CustomError = {
	response?: {
		data?: {
			message?: string;
		};
	};
};

interface FormData {
	typeId: string;
	name: string;
	status: string;
	clientName: string;
	transportMode: string;
	serviceType: string;
	expectedDeliveryDate: string;
	arrivalTime: string;
	departureTime: string;
	driverPhoneNumber: string;
	vehicleType: string;
	vehicleColour: string;
	vehicleNumber: string;
	vehicleTannage: string;
	driverName: string;
	transportType: string;
	description: string;
}

interface Errors {
	driverPhoneNumber: string;
}

const JobRecord = () => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showUpdateStatusModal, setShowUpdateStatusModal] =
		useState<boolean>(false);
	const router = useRouter();
	const { data: jobTypes } = useFetchJobTypes();
	const { showToast } = useToast();
	const { id: pageId } = useParams<{ id: string }>();

	const { data, isLoading } = useFetchJobDetails(pageId);
	const { mutate, isPending } = useDeleteJob();
	const [errors, setErrors] = useState<Errors>({
		driverPhoneNumber: "",
	});
	const [disable, setDisable] = useState<boolean>(true);
	const [formData, setFormData] = useState<FormData>({
		typeId: "",
		name: "",
		status: "",
		clientName: "",
		transportMode: "",
		serviceType: "",
		expectedDeliveryDate: "",
		arrivalTime: "",
		departureTime: "",
		driverPhoneNumber: "",
		vehicleType: "",
		vehicleColour: "",
		vehicleNumber: "",
		vehicleTannage: "",
		driverName: "",
		transportType: "",
		description: "",
	});

	useEffect(() => {
		if (data) {
			setFormData({
				typeId: data.typeId,
				name: data.name,
				status: data.status,
				clientName: data.clientName,
				transportMode: data.transportMode,
				serviceType: data.serviceType,
				expectedDeliveryDate: makeDateValue(data.expectedDeliveryDate),
				arrivalTime: data.arrivalTime,
				departureTime: data.departureTime,
				driverPhoneNumber: data.driverPhoneNumber,
				vehicleType: data.vehicleType,
				vehicleColour: data.vehicleColour,
				vehicleNumber: data.vehicleNumber,
				vehicleTannage: data.vehicleTannage,
				driverName: data.driverName,
				transportType: data.transportType,
				description: data.description,
			});
		}
	}, [data]);

	const {
		mutate: updateJob,
		isPending: isUpdatingJob,
		// data: updatedJobs,
	} = useUpdateJob();

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
				showToast("Job Deleted Successfully", "success");
				router.push("/jobs");
			},
			onError: (error: unknown) => {
				if (isCustomError(error)) {
					const message =
						error.response?.data?.message || "Error deleting job";
					console.error("Failed to delete job:", error);
					showToast(message, "error");
				} else {
					console.error("Unexpected error:", error);
					showToast("An unexpected error occurred", "error");
				}
			},
		});
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		if (name === "driverPhoneNumber") {
			const onlyNumbers = value.replace(/[^0-9]/g, "");
			if (onlyNumbers.length > 11) {
				setErrors((prev) => ({
					...prev,
					driverPhoneNumber: "Phone number cannot exceed 11 digits.",
				}));
			} else if (onlyNumbers.length < 11) {
				setErrors((prev) => ({
					...prev,
					driverPhoneNumber:
						"Phone number must be exactly 11 digits.",
				}));
			} else {
				setErrors((prev) => ({
					...prev,
					driverPhoneNumber: "",
				}));
			}
			setFormData((prev) => ({
				...prev,
				driverPhoneNumber: onlyNumbers,
			}));
			setDisable(false);

			return;
		}

		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		setDisable(false);
	};

	const handleUpdate = () => {
		updateJob(
			{
				jobId: pageId,
				data: {
					...formData,
					expectedDeliveryDate: new Date(
						formData.expectedDeliveryDate
					).toISOString(),
				},
			},
			{
				onSuccess: () => {
					showToast("Job Updated Successfully", "success");
				},
				onError: (error: unknown) => {
					if (isCustomError(error)) {
						const message =
							error.response?.data?.message ||
							"Error updating job";
						console.error("Failed to update job:", error);
						showToast(message, "error");
					} else {
						console.error("Unexpected error:", error);
						showToast("An unexpected error occurred", "error");
					}
				},
			}
		);
	};

	function makeDateValue(expectedDeliveryDate: string) {
		console.log(expectedDeliveryDate);

		if (!expectedDeliveryDate) return;

		const date = new Date(expectedDeliveryDate);

		return date.toISOString().split("T")[0];
	}

	return (
		<>
			<DashboardHead name="Job" />

			{isLoading ? (
				<div className="flex items-center justify-center w-full h-full text-xl">
					Loading...
				</div>
			) : (
				<>
					<div className="flex border-b border-b-1 border-b-[#CCCCCC] items-center justify-between px-4 py-3 sticky left-0 top-[6.25rem] right-0 bg-[#f0f0f0]">
						<div className=" flex items-center gap-4">
							<BackIconButton />

							<span className="text-[#1D1D1D] font-semibold text-lg">
								Jobs Record
							</span>
						</div>

						<div className="flex items-center gap-3">
							<button
								type="button"
								className="w-[141px] h-[54px] rounded-[10px] bg-[#FFDFDF] font-medium text-[#FF3030]"
								onClick={() => setShowModal(true)}
							>
								Delete
							</button>
							<button
								onClick={() => setShowUpdateStatusModal(true)}
								className="w-[162px] h-11 rounded-[10px] border border-[#1E1E1E] text-[#1D1D1D] font-poppins"
							>
								Update Status
							</button>

							<button
								className="w-[104px] h-11 rounded-[10px] bg-[#1E1E1E] text-white font-poppins disabled:bg-[#F4F4F4] disabled:text-[#3D3D3D] disabled:pointer-events-none"
								onClick={handleUpdate}
								disabled={disable || isUpdatingJob}
							>
								{isUpdatingJob ? "Updating..." : "Save"}
							</button>
						</div>
					</div>

					<div className="bg-white p-4 sm:p-10 ">
						<div className="sm:flex gap-[8%]">
							<div>
								<div className="flex flex-col gap-2 mt-5">
									<label
										htmlFor=""
										className="text-[#6C757D] font-medium text-sm"
									>
										Job ID
									</label>
									<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] ">
										<input
											type="text"
											className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D] disabled:bg-[#f8f8f8] p-4"
											placeholder="#100232"
											value={data?.jId}
											disabled
										/>
									</div>
								</div>

								<div className="flex flex-col gap-2 mt-5">
									<label
										htmlFor="Job Title"
										className="text-[#6C757D] font-medium text-sm"
									>
										Job Title
									</label>
									<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
										<input
											type="text"
											className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
											name="name"
											value={formData?.name}
											onChange={handleChange}
										/>
									</div>
								</div>

								<div className="flex flex-col gap-2 mt-5">
									<label
										htmlFor="Client Name"
										className="text-[#6C757D] font-medium text-sm"
									>
										Client Name*
									</label>
									<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
										<input
											type="text"
											className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
											// placeholder="John Chimney"
											name="clientName"
											value={formData?.clientName}
											onChange={handleChange}
										/>
									</div>
								</div>

								<div className="flex flex-col gap-2 mt-5">
									<label
										htmlFor="Expected Delivery Date"
										className="text-[#6C757D] font-medium text-sm"
									>
										Expected Delivery Date*
									</label>
									<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
										<input
											id="delivery-date"
											type="datetime-local"
											className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D] appearance-none z-20"
											onChange={(e) => {
												const dateTimeValue = new Date(
													e.target.value
												).toISOString();
												setFormData((prevValues) => ({
													...prevValues,
													expectedDeliveryDate:
														dateTimeValue,
												}));
											}}
										/>
										{/* <input
											id="delivery-date"
											type="date"
											className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D] appearance-none z-20"
											defaultValue={
												formData?.expectedDeliveryDate
											}
											onChange={(e) => {
												const date = new Date(
													e.target.value
												);

												setFormData((prevValues) => ({
													...prevValues,
													expectedDeliveryDate:
														date.toISOString(),
												}));
												setDisable(false);
											}}
										/> */}
									</div>
								</div>

								<div className="flex flex-col gap-2 mt-5">
									<label
										htmlFor=""
										className="text-[#6C757D] font-medium text-sm"
									>
										Status
									</label>
									<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
										<select
											name="status"
											value={formData?.status}
											onChange={handleChange}
											className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
										>
											<option value="">
												Select status
											</option>
											<option value="Open">Open</option>
											<option value="InProgress">
												In Progress
											</option>
											<option value="Completed">
												Completed
											</option>
											<option value="Cancelled">
												Cancelled
											</option>
										</select>
									</div>
								</div>

								<div className="flex flex-col gap-2 mt-5">
									<label
										htmlFor="Description"
										className="text-[#6C757D] font-medium text-sm"
									>
										Description
									</label>
									<div className="sm:w-[400px] border border-[#CCCCCC] rounded-[10px] px-4">
										<textarea
											name="description"
											value={formData?.description}
											onChange={handleChange}
											className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
										></textarea>
									</div>
								</div>
							</div>

							<div>
								<div className="flex flex-col gap-2 mt-5">
									<label
										htmlFor="Job Type"
										className="text-[#6C757D] font-medium text-sm"
									>
										Job Type*
									</label>
									<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
										<select
											className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
											value={formData?.typeId}
											onChange={(e) => {
												setFormData((prevValues) => ({
													...prevValues,
													typeId: e.target.value,
												}));
												setDisable(false);
											}}
										>
											<option value="">
												Choose a job type
											</option>

											{jobTypes?.map((type) => (
												<option
													key={type?.id}
													value={type?.id}
												>
													{type?.name}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="flex flex-col gap-2 mt-5">
									<label
										htmlFor="Transport Mode"
										className="text-[#6C757D] font-medium text-sm"
									>
										Transport Mode
									</label>
									<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
										<select
											name="transportMode"
											value={formData?.transportMode}
											onChange={handleChange}
											className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
										>
											<option value="">
												Select transport mode
											</option>
											<option value="Land">Land</option>
											<option value="Air">Air</option>
											<option value="Sea">Sea</option>
										</select>
									</div>
								</div>

								<div className="flex flex-col gap-2 mt-5">
									<label
										htmlFor="Service Type"
										className="text-[#6C757D] font-medium text-sm"
									>
										Service Type*
									</label>
									<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
										<input
											type="text"
											className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
											name="serviceType"
											value={formData?.serviceType}
											onChange={handleChange}
										/>
									</div>
								</div>

								<div className="flex flex-col gap-2 mt-5">
									<label
										htmlFor="Arrival Time"
										className="text-[#6C757D] font-medium text-sm"
									>
										Arrival Time*
									</label>
									<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
										<input
											id="delivery-date"
											type="time"
											className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D] appearance-none z-20"
											defaultValue={formData.arrivalTime}
											onChange={(e) => {
												setFormData((prevValues) => ({
													...prevValues,
													arrivalTime: e.target.value,
												}));
												setDisable(false);
											}}
										/>
									</div>
								</div>

								<div className="flex flex-col gap-2 mt-5">
									<label
										htmlFor="departure-time"
										className="text-[#6C757D] font-medium text-sm"
									>
										Departure Time*
									</label>
									<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
										<input
											id="departure-time"
											type="time"
											name="departureTime"
											className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D] appearance-none z-20"
											defaultValue={
												formData.departureTime
											}
											onChange={handleChange}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="mt-10">
							<h4 className="text-[#1D1D1D] font-medium border-b border-[#CCCCCC]">
								Vehicle Description
							</h4>
							<div className="sm:flex gap-[8%]">
								<div>
									<div className="flex flex-col gap-2 mt-5">
										<label
											htmlFor=""
											className="text-[#6C757D] font-medium text-sm"
										>
											Vehicle Type
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
											<input
												type="text"
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												name="vehicleType"
												value={formData?.vehicleType}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className="flex flex-col gap-2 mt-5">
										<label
											htmlFor=""
											className="text-[#6C757D] font-medium text-sm"
										>
											Vehicle Number
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
											<input
												type="text"
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												name="vehicleNumber"
												value={formData?.vehicleNumber}
												onChange={handleChange}
											/>
										</div>
									</div>
								</div>

								<div>
									<div className="flex flex-col gap-2 mt-5">
										<label
											htmlFor=""
											className="text-[#6C757D] font-medium text-sm"
										>
											Vehicle Colour
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
											<input
												type="text"
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												name="vehicleColour"
												value={formData?.vehicleColour}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className="flex flex-col gap-2 mt-5">
										<label
											htmlFor=""
											className="text-[#6C757D] font-medium text-sm"
										>
											Vehicle Tonnage
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
											<input
												type="text"
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												name="vehicleTannage"
												value={formData?.vehicleTannage}
												onChange={handleChange}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="mt-10">
							<h4 className="text-[#1D1D1D] font-medium border-b border-[#CCCCCC]">
								Transport Description
							</h4>
							<div className="sm:flex gap-[8%]">
								<div>
									<div className="flex flex-col gap-2 mt-5">
										<label
											htmlFor=""
											className="text-[#6C757D] font-medium text-sm"
										>
											Driver Name
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
											<input
												type="text"
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												name="driverName"
												value={formData?.driverName}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className="flex flex-col gap-2 mt-5">
										<label
											htmlFor=""
											className="text-[#6C757D] font-medium text-sm"
										>
											Transport Type
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
											<input
												type="text"
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												placeholder="Cold Chain"
												name="transportType"
												value={formData?.transportType}
												onChange={handleChange}
											/>
										</div>
									</div>
								</div>

								<div>
									<div className="flex flex-col gap-2 mt-5 relative">
										<label
											htmlFor="Phone Number"
											className="text-[#6C757D] font-medium text-sm"
										>
											Phone Number
										</label>
										<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
											<input
												type="text"
												className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												name="driverPhoneNumber"
												value={
													formData?.driverPhoneNumber
												}
												onChange={handleChange}
											/>
										</div>
										{errors.driverPhoneNumber && (
											<span className="text-red-500 text-[12px] absolute -bottom-4 left-0">
												{errors.driverPhoneNumber}
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					{showModal && (
						<JobActionModal
							onClosed={() => setShowModal(false)}
							handleDelete={handleDelete}
							isPending={isPending}
						/>
					)}
				</>
			)}

			{showUpdateStatusModal && (
				<UpdateStatusModal
					id={data!.id}
					onClosed={() => setShowUpdateStatusModal(false)}
				/>
			)}
		</>
	);
};

export default JobRecord;
