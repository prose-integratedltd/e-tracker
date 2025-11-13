"use client";

import React, { useEffect, useState } from "react";
import { useCreateUser } from "@/hooks/mutations/useCreateUser";
import { useToast } from "@/context/ToastContext";
import { useFetchDepartments } from "@/hooks/queries/useFetchDepartments";
import { useFetchOperationLocations } from "@/hooks/queries/useFetchOperationLocations";

interface CreateUserProps {
	setShowCreateUser: (value: boolean) => void;
}

interface FormData {
	username: string;
	email: string;
	fullname: string;
	phoneNumber: string;
	departmentId: string;
	operationLocationId: string;
	roles: string[];
	password: string;
}

interface Errors {
	phoneNumber: string;
}

type CustomError = {
	response?: {
		data?: {
			message?: string;
		};
	};
};

const CreateUser: React.FC<CreateUserProps> = ({ setShowCreateUser }) => {
	const [isSwitchOn, setIsSwitchOn] = useState(false);
	const [isFormValid, setIsFormValid] = useState(false);
	const { mutate, isPending } = useCreateUser();
	const { data: departments } = useFetchDepartments();
	const { data: operationLocations } = useFetchOperationLocations();

	const { showToast } = useToast();

	const [formData, setFormData] = useState<FormData>({
		username: "",
		email: "",
		fullname: "",
		phoneNumber: "",
		departmentId: "",
		operationLocationId: "",
		roles: ["user"],
		password: "",
	});

	const [errors, setErrors] = useState<Errors>({
		phoneNumber: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
			return;
		}

		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const toggleSwitch = () => {
		setIsSwitchOn((prev) => {
			const newSwitchState = !prev;

			setFormData((prevFormData) => ({
				...prevFormData,
				roles: newSwitchState ? ["admin"] : ["user"],
			}));

			return newSwitchState;
		});
	};

	useEffect(() => {
		const areAllFieldsFilled = !!(
			formData.username.trim() &&
			formData.email.trim() &&
			formData.fullname.trim() &&
			formData.phoneNumber.trim() &&
			formData.password.trim()
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
			formData.phoneNumber.length === 11
				? `234${formData.phoneNumber.slice(1)}`
				: "";

		if (!formattedPhoneNumber) {
			showToast("Please enter a valid phone number.", "error");
			return;
		}

		if (!isFormValid) {
			showToast("Please enter all fields.", "error");
			return;
		}

		if (!formData?.departmentId) {
			showToast("Please choose a department.", "error");
			return;
		}

		if (!formData?.operationLocationId) {
			showToast("Please choose an Operation Location.", "error");
			return;
		}

		mutate(
			{ ...formData, phoneNumber: formattedPhoneNumber },
			{
				onSuccess: () => {
					showToast("User Created Successfully", "success");
					setShowCreateUser(false);
				},

				onError: (error: unknown) => {
					if (isCustomError(error)) {
						const message =
							error.response?.data?.message ||
							"Error creating user";
						console.error("Failed to create user:", error);
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
		<div className="p-4 sm:p-7 w-full">
			<div className="w-full px-4 sm:px-24 py-7 bg-white rounded-[16px] relative h-full pb-8">
				<button
					className="w-[45px] h-[45px] bg-[#F4F4F4] rounded-full flex items-center justify-center absolute sm:left-7 left-4 sm:top-7 top-4"
					onClick={() => setShowCreateUser(false)}
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
					<h3 className="text-[#1D1D1D] text-[22px] font-semibold text-center sm:text-left">
						Create New User
					</h3>

					<div className="sm:flex justify-between mt-3">
						<div>
							{/* <div className="flex flex-col gap-2 mt-5">
                <label
                  htmlFor=""
                  className="text-[#6C757D] font-medium text-sm"
                >
                  User ID
                </label>
                <div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
                  <input
                    type="text"
                    className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
                    placeholder="#100232"
                  />
                </div>
              </div> */}

							<div className="flex flex-col gap-2 mt-5">
								<label
									htmlFor=""
									className="text-[#6C757D] font-medium text-sm"
								>
									Username*
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
									<input
										type="text"
										name="username"
										value={formData.username}
										onChange={handleChange}
										className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2 mt-5">
								<label
									htmlFor=""
									className="text-[#6C757D] font-medium text-sm"
								>
									Full name*
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
									<input
										type="text"
										name="fullname"
										value={formData.fullname}
										onChange={handleChange}
										className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2 mt-5">
								<label
									htmlFor=""
									className="text-[#6C757D] font-medium text-sm"
								>
									Department*
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
									<select
										id=""
										className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
										onChange={(e) => {
											setFormData((prevValues) => ({
												...prevValues,
												departmentId: e.target.value,
											}));
										}}
									>
										{" "}
										<option value="">
											Choose a department
										</option>
										{departments?.map((department) => (
											<option
												key={department?.id}
												value={department?.id}
											>
												{department?.name}
											</option>
										))}
									</select>
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
										onChange={(e) => {
											setFormData((prevValues) => ({
												...prevValues,
												operationLocationId:
													e.target.value,
											}));
										}}
									>
										<option value="">
											Choose a location
										</option>

										{operationLocations?.map(
											(operationLocation) => (
												<option
													key={operationLocation?.id}
													value={
														operationLocation?.id
													}
												>
													{operationLocation?.name}
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
									htmlFor=""
									className="text-[#6C757D] font-medium text-sm"
								>
									Email*
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
										placeholder=""
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
										value={formData.phoneNumber}
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
									htmlFor=""
									className="text-[#6C757D] font-medium text-sm"
								>
									Password*
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
									<input
										type="password"
										name="password"
										value={formData.password}
										onChange={handleChange}
										className="w-full h-full bg-transparent outline-none text-lg text-[#1D1D1D] placeholder:text-[#1D1D1D]"
									/>
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
								Grant this User administrator&apos;s role
							</span>
						</div>
						<button
							type="button"
							onClick={toggleSwitch}
							className={`relative inline-flex items-center h-8 rounded-full w-[60px] transition-all border-[#C2CBCD] ${
								isSwitchOn ? "bg-[#19469D]" : "bg-[#F3F3F3]"
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
						disabled={!isFormValid || isPending}
					>
						{isPending ? "Loading..." : "Submit"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateUser;
