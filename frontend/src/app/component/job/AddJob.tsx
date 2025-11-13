"use client";

import { useCreateJob } from "@/hooks/mutations/useCreateJob";
import React, { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { useFetchJobTypes } from "@/hooks/queries/useFetchJobTypes";
import BackIconButton from "../icons/back.icon";

type AddJobProps = {
	setShowAddJob: (show: boolean) => void;
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

type CustomError = {
	response?: {
		data?: {
			message?: string;
		};
	};
};

const AddJob: React.FC<AddJobProps> = ({ setShowAddJob }) => {
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const { mutate, isPending } = useCreateJob();
	const { data: jobTypes } = useFetchJobTypes();

	const { showToast } = useToast();

	const [formData, setFormData] = useState<FormData>({
		typeId: "",
		name: "",
		status: "Open",
		clientName: "",
		transportMode: "Land",
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

	const [errors, setErrors] = useState<Errors>({
		driverPhoneNumber: "",
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
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
			return;
		}

		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	useEffect(() => {
		const areAllFieldsFilled = !!(
			formData.name.trim() &&
			formData.clientName.trim() &&
			formData.serviceType.trim() &&
			formData.expectedDeliveryDate.trim() &&
			formData.arrivalTime.trim() &&
			formData.driverPhoneNumber.trim() &&
			formData.vehicleType.trim() &&
			formData.vehicleColour.trim() &&
			formData.vehicleNumber.trim() &&
			formData.vehicleTannage.trim() &&
			formData.driverName.trim() &&
			formData.transportType.trim() &&
			formData.description.trim()
		);
		setIsFormValid(areAllFieldsFilled);
	}, [formData]);

	const isCustomError = (error: unknown): error is CustomError => {
		return (
			typeof error === "object" &&
			error !== null &&
			"response" in error &&
			typeof (error as CustomError).response === "object"
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const formattedPhoneNumber =
			formData.driverPhoneNumber.length === 11
				? `234${formData.driverPhoneNumber.slice(1)}`
				: "";

		if (!formattedPhoneNumber) {
			showToast("Please enter a valid phone number.", "error");
			return;
		}

		if (!isFormValid) {
			showToast("Please enter all fields.", "error");
			return;
		}

		if (!formData.status) {
			showToast("Please select a status.", "error");
			return;
		}

		if (!formData.typeId) {
			showToast("Please select a type ID.", "error");
			return;
		}

		if (!formData.transportMode) {
			showToast("Please select a transport mode.", "error");
			return;
		}

		mutate(
			{ ...formData, driverPhoneNumber: formattedPhoneNumber },
			{
				onSuccess: () => {
					showToast("Job Created Successfully", "success");
					setShowAddJob(false);
				},

				onError: (error: unknown) => {
					if (isCustomError(error)) {
						const message =
							error.response?.data?.message ||
							"Error creating job";
						showToast(message, "error");
					} else {
						showToast("An unexpected error occurred", "error");
					}
				},
			}
		);
	};

	return (
		<div>
			<div className="flex border-b border-b-1 border-b-[#CCCCCC] items-center justify-between px-4 py-3 sticky left-0 top-[6.25rem] right-0 bg-[#f0f0f0]">
				<div className=" flex items-center gap-4">
					<BackIconButton />

					<span className="text-[#1D1D1D] font-semibold text-lg">
						Jobs Record
					</span>
				</div>

				<button
					className="w-[104px] h-11 rounded-[10px] bg-[#1E1E1E] text-white font-poppins disabled:bg-[#F4F4F4] disabled:text-[#3D3D3D] disabled:pointer-events-none"
					onClick={handleSubmit}
					disabled={!isFormValid || isPending}
				>
					{isPending ? "Saving..." : "Save"}
				</button>
			</div>

			<div className="bg-white p-4 sm:px-10">
				<div className="sm:flex gap-[8%] mt-3">
					<div>
						<div className="flex flex-col gap-2 mt-5">
							<label
								htmlFor=""
								className="text-[#6C757D] font-medium text-sm"
							>
								Job Title
							</label>
							<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
								<input
									type="text"
									className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
									name="name"
									value={formData.name}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2 mt-5">
							<label
								htmlFor=""
								className="text-[#6C757D] font-medium text-sm"
							>
								Client Name*
							</label>
							<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
								<input
									type="text"
									className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
									name="clientName"
									value={formData.clientName}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2 mt-5">
							<label
								htmlFor=""
								className="text-[#6C757D] font-medium text-sm"
							>
								Expected Delivery Date*
							</label>
							<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
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
											expectedDeliveryDate: dateTimeValue,
										}));
									}}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2 mt-5">
							<label
								htmlFor=""
								className="text-[#6C757D] font-medium text-sm"
							>
								Status
							</label>
							<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] ">
								<select
									name="status"
									value={formData.status}
									onChange={handleChange}
									className="w-full h-full bg-transparent outline-none text-lg px-4 text-[#1D1D1D] placeholder:text-[#1D1D1D]"
								>
									<option selected value="Open">
										Open
									</option>
									<option value="InProgress">
										InProgress
									</option>
									<option value="Completed">Completed</option>
									<option value="Cancelled">Cancelled</option>
								</select>
							</div>
						</div>

						<div className="flex flex-col gap-2 mt-5">
							<label
								htmlFor=""
								className="text-[#6C757D] font-medium text-sm"
							>
								Description
							</label>
							<div className="sm:w-[400px] border border-[#CCCCCC] rounded-[10px] px-4">
								<textarea
									name="description"
									value={formData.description}
									onChange={handleChange}
									className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
								></textarea>
							</div>
						</div>
					</div>

					<div>
						<div className="flex flex-col gap-2 mt-5">
							<label
								htmlFor=""
								className="text-[#6C757D] font-medium text-sm"
							>
								Job Type*
							</label>
							<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px]">
								<select
									className="w-full h-full bg-transparent outline-none px-4 text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
									value={formData.typeId}
									onChange={(e) => {
										setFormData((prevValues) => ({
											...prevValues,
											typeId: e.target.value,
										}));
									}}
								>
									<option value="" />
									{jobTypes?.map((type, index) => (
										<option
											selected={index === 0}
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
								htmlFor=""
								className="text-[#6C757D] font-medium text-sm"
							>
								Transport Mode
							</label>
							<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px]">
								<select
									name="transportMode"
									value={formData.transportMode}
									onChange={handleChange}
									className="w-full h-full bg-transparent outline-none text-lg px-4 text-[#1D1D1D] placeholder:text-[#1D1D1D]"
								>
									<option selected value="Land">
										Land
									</option>
									<option value="Air">Air</option>
									<option value="Sea">Sea</option>
								</select>
							</div>
						</div>

						<div className="flex flex-col gap-2 mt-5">
							<label
								htmlFor="service-type"
								className="text-[#6C757D] font-medium text-sm"
							>
								Service Type*
							</label>
							<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
								<input
									id="service-type"
									type="text"
									className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
									name="serviceType"
									value={formData.serviceType}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2 mt-5">
							<label
								htmlFor=""
								className="text-[#6C757D] font-medium text-sm"
							>
								Arrival Time*
							</label>
							<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
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
									}}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2 mt-5">
							<label
								htmlFor="departure-date"
								className="text-[#6C757D] font-medium text-sm"
							>
								Departure Time*
							</label>
							<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
								<input
									id="departure-date"
									type="time"
									className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D] appearance-none z-20"
									defaultValue={formData.departureTime}
									onChange={(e) => {
										setFormData((prevValues) => ({
											...prevValues,
											departureTime: e.target.value,
										}));
									}}
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
									Vehicle Type*
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
									<input
										type="text"
										className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
										name="vehicleType"
										value={formData.vehicleType}
										onChange={handleChange}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2 mt-5">
								<label
									htmlFor=""
									className="text-[#6C757D] font-medium text-sm"
								>
									Vehicle Number*
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
									<input
										type="text"
										className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
										name="vehicleNumber"
										value={formData.vehicleNumber}
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
									Vehicle Colour*
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
									<input
										type="text"
										className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
										name="vehicleColour"
										value={formData.vehicleColour}
										onChange={handleChange}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2 mt-5">
								<label
									htmlFor=""
									className="text-[#6C757D] font-medium text-sm"
								>
									Vehicle Tonnage*
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
									<input
										type="text"
										className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
										name="vehicleTannage"
										value={formData.vehicleTannage}
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
									Driver Name*
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
									<input
										type="text"
										className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
										name="driverName"
										value={formData.driverName}
										onChange={handleChange}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2 mt-5">
								<label
									htmlFor=""
									className="text-[#6C757D] font-medium text-sm"
								>
									Transport Type*
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
									<input
										type="text"
										className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
										name="transportType"
										value={formData.transportType}
										onChange={handleChange}
									/>
								</div>
							</div>
						</div>

						<div>
							<div className="flex flex-col gap-2 mt-5 relative">
								<label
									htmlFor=""
									className="text-[#6C757D] font-medium text-sm"
								>
									Phone Number*
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
									<input
										type="text"
										className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
										name="driverPhoneNumber"
										value={formData.driverPhoneNumber}
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

				{/* <button
					className="bg-[#1E1E1E] w-full sm:w-[400px] h-[54px] rounded-[10px] text-white font-semibold disabled:bg-[#F4F4F4] disabled:text-[#3D3D3D] disabled:pointer-events-none mt-20 sm:mt-40"
					onClick={handleSubmit}
					disabled={!isFormValid || isPending}
				>
					{isPending ? "Loading..." : "Save"}
				</button> */}
			</div>
		</div>
	);
};

export default AddJob;
