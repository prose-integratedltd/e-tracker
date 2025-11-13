"use client";

import { useToast } from "@/context/ToastContext";
import { useUpdateAuthUser } from "@/hooks/mutations/useUpdateUser";
import { useFetchAuthUser } from "@/hooks/queries/useFetchAuthUser";
import { useFetchOperationLocations } from "@/hooks/queries/useFetchOperationLocations";
import { UpdateUserPayload } from "@/lib/queries/updateUser";
import Image from "next/image";
import React, { useEffect, useState } from "react";
// import ReactLoading from "react-loading";

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

const UserSettings = () => {
	const [disable, setDisable] = useState<boolean>(true);
	const [errors, setErrors] = useState<Errors>({
		phoneNumber: "",
	});
	const [previewImage, setPreviewImage] = useState<string>(
		"https://res.cloudinary.com/do3peojms/image/upload/v1738084207/user-avatar_uvsktz.png"
	);
	// const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const { showToast } = useToast();
	const { data: operationLocations } = useFetchOperationLocations();
	const { data, isLoading } = useFetchAuthUser();
	const { mutate: updateUser, isPending } = useUpdateAuthUser();

	const [formData, setFormData] = useState<UpdateUserPayload>({});

	useEffect(() => {
		if (data) {
			setFormData({
				fullname: data?.fullname,
				phoneNumber: data?.phoneNumber,
				departmentId: data?.departmentId,
				operationLocationId: data?.operationLocationId,
				roles: data.roles,
				password: data?.password,
				profilePicture: data?.profilePicture,
			});
		}
	}, [data]);

	const handleImageChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setPreviewImage(URL.createObjectURL(file));

		const body = new FormData();
		body.append("file", file);
		body.append("upload_preset", "prose-image-upload");
		body.append("cloud_name", "do3peojms");

		await fetch("https://api.cloudinary.com/v1_1/do3peojms/image/upload", {
			method: "POST",
			body: body,
		})
			.then((res) => res.json())
			.then((data) => {
				setFormData((prev) => ({
					...prev,
					profilePicture: data.secure_url,
				}));

				setDisable(false);

				updateUser(
					{
						payload: { profilePicture: formData.profilePicture },
					},
					{
						onError() {
							showToast(
								"Error updating profile picture",
								"error"
							);
						},
					}
				);
			});
	};

	const isCustomError = (error: unknown): error is CustomError => {
		return (
			typeof error === "object" &&
			error !== null &&
			"response" in error &&
			typeof (error as CustomError).response === "object"
		);
	};

	const handleSubmit = async () => {
		updateUser(
			{
				payload: formData,
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

	const deletePicture = () => {
		setFormData({ ...formData, profilePicture: "" });
		updateUser(
			{
				payload: { profilePicture: null },
			},
			{
				onSuccess() {
					showToast(
						"Profile picture deleted successfully",
						"success"
					);
				},
				onError(error) {
					showToast(error.message, "error");
				},
			}
		);
		// handleSubmit();
	};

	return (
		<>
			{isLoading ? (
				<div className="flex items-center justify-center w-full h-full text-xl">
					{/* <ReactLoading type="bars" color="#000" /> */}
					Loading...
				</div>
			) : (
				<div className="w-full p-4 sm:p-7">
					<div className="flex flex-col sm:flex-row gap-7 w-full">
						<div className="sm:w-[33%] h-[680px] rounded-[16px] bg-white flex flex-col items-center justify-center">
							<Image
								src={formData?.profilePicture || previewImage}
								alt=""
								className="w-[200px] h-[200px] object-cover"
								width={200}
								height={200}
							/>

							<h3 className="text-[22px] font-semibold text-[#1D1D1D] mt-3">
								{data?.fullname}
							</h3>

							<p className="text-[#1D1D1D] mt-1 capitalize">
								{data?.roles[0]}
							</p>

							<span className="text-[#898989] text-sm mt-1">
								{
									operationLocations?.find(
										(location) =>
											location.id ===
											data?.operationLocationId
									)?.name
								}
							</span>

							<input
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="w-[243px] h-[54px] rounded-[10px] bg-[#1D1D1D] text-white font-medium cursor-pointer opacity-0"
								id="fileInput"
							/>

							<label
								htmlFor="fileInput"
								className="w-[243px] h-[54px] rounded-[10px] bg-[#1D1D1D] font-medium text-white mt-8 text-center cursor-pointer flex items-center justify-center"
							>
								Upload new Picture
							</label>

							{/* <button className="w-[243px] h-[54px] rounded-[10px] bg-[#1D1D1D] font-medium text-white mt-8">
                Upload new Picture
              </button> */}

							<button
								className="w-[243px] h-[54px] rounded-[10px] bg-[#F4F4F4] border border-[#00000033] font-medium text-[#3D3D3D] mt-3"
								onClick={deletePicture}
							>
								Delete Picture
							</button>
						</div>

						<div className="sm:w-[67%] rounded-[20px] bg-white p-7">
							<div>
								<div>
									<h4 className="text-[#1D1D1D] text-lg font-semibold pb-3">
										Your Information
									</h4>
									<div className="flex flex-col sm:flex-row gap-4 justify-between w-full">
										<div className="flex flex-col gap-1.5">
											<label
												htmlFor="Username"
												className="text-[#6C757D] font-medium text-sm"
											>
												Username
											</label>
											<div className="sm:w-[300px] h-[54px] border border-[#CCCCCC] rounded-[10px]">
												<input
													type="text"
													className="w-full h-full bg-transparent outline-none text-sm p-4 text-[#1D1D1D] placeholder:text-[#1D1D1D]"
													placeholder="kolade_simon"
													name="username"
													value={data?.username}
													onChange={handleChange}
													disabled
												/>
											</div>
										</div>

										<div className="flex flex-col gap-1.5">
											<label
												htmlFor=""
												className="text-[#6C757D] font-medium text-sm"
											>
												Pronouns
											</label>
											<div className="sm:w-[300px] h-[54px] border border-[#CCCCCC] rounded-[10px]">
												<select
													name=""
													id=""
													className="w-full h-full bg-transparent outline-none text-sm p-4 text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												>
													<option value="">He</option>
													<option value="">
														She
													</option>
												</select>
											</div>
										</div>
									</div>

									<div className="flex flex-col gap-1.5 mt-3">
										<label
											htmlFor="Fullname"
											className="text-[#6C757D] font-medium text-sm"
										>
											Full name
										</label>
										<div className="sm:w-[300px] h-[54px] border border-[#CCCCCC] rounded-[10px]">
											<input
												type="text"
												className="w-full h-full bg-transparent outline-none text-sm p-4 text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												placeholder="kolade_simon"
												name="fullname"
												value={formData?.fullname ?? ""}
												onChange={handleChange}
											/>
										</div>
									</div>
								</div>

								<div className="mt-7">
									<h4 className="text-[#1D1D1D] text-lg font-semibold pb-3">
										Contact Information
									</h4>
									<div className="flex flex-col sm:flex-row gap-4 justify-between w-full">
										<div className="flex flex-col gap-1.5">
											<label
												htmlFor="Email"
												className="text-[#6C757D] font-medium text-sm"
											>
												Email
											</label>
											<div className="sm:w-[300px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
												<input
													type="email"
													className="w-full h-full bg-transparent outline-none text-sm text-[#1D1D1D] placeholder:text-[#1D1D1D]"
													placeholder="koladesimon@yahoo.com"
													name="email"
													value={data?.email}
													onChange={handleChange}
													disabled
												/>
											</div>
										</div>

										<div className="flex flex-col gap-1.5">
											<label
												htmlFor="Operation location"
												className="text-[#6C757D] font-medium text-sm"
											>
												Operation location
											</label>
											<div className="sm:w-[300px] h-[54px] border border-[#CCCCCC] rounded-[10px] px-4">
												<select
													name="operationLocationId"
													value={
														formData?.operationLocationId ??
														""
													}
													onChange={(e) => {
														setFormData(
															(prevValues) => ({
																...prevValues,
																operationLocationId:
																	e.target
																		.value,
															})
														);
														setDisable(false);
													}}
													className="w-full h-full bg-transparent outline-none text-sm text-[#1D1D1D] placeholder:text-[#1D1D1D]"
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

									<div className="flex flex-col gap-1.5 mt-3 relative">
										<label
											htmlFor=""
											className="text-[#6C757D] font-medium text-sm"
										>
											Phone
										</label>
										<div className="sm:w-[300px] h-[54px] border border-[#CCCCCC] rounded-[10px]">
											<input
												type="text"
												className="w-full h-full bg-transparent outline-none text-sm p-4 text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												placeholder="08076543421"
												name="phoneNumber"
												value={
													formData?.phoneNumber ?? ""
												}
												onChange={handleChange}
											/>
										</div>
										{errors.phoneNumber && (
											<span className="text-red-500 text-[12px] absolute -bottom-4 left-0">
												{errors.phoneNumber}
											</span>
										)}
									</div>
								</div>

								<div className="mt-7">
									{/* <h4 className="text-[#1D1D1D] text-lg font-semibold pb-3">
										Change password
									</h4>

									<div className="flex flex-col gap-1.5 mt-3">
										<label
											htmlFor=""
											className="text-[#6C757D] font-medium text-sm"
										>
											Current Password
										</label>
										<div className="sm:w-[300px] h-[54px] border border-[#CCCCCC] rounded-[10px]">
											<input
												type="password"
												className="w-full h-full bg-transparent outline-none text-sm p-4 text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												name="password"
												// value={formData?.confirmPassword ?? ""}
												disabled
											/>
										</div>
									</div> */}

									<div className="flex flex-col gap-1.5 mt-3">
										<label
											htmlFor="New password"
											className="text-[#6C757D] font-medium text-sm"
										>
											New Password
										</label>
										<div className="sm:w-[300px] h-[54px] border border-[#CCCCCC] rounded-[10px] p-4">
											<input
												type="password"
												className="w-full h-full bg-transparent outline-none text-sm text-[#1D1D1D] placeholder:text-[#1D1D1D]"
												name="password"
												value={formData?.password ?? ""}
												onChange={handleChange}
											/>
										</div>
									</div>
								</div>

								<div className="w-full flex items-center justify-center mt-10">
									<button
										className="w-[450px] h-[54px] rounded-[10px] bg-[#1E1E1E] text-white font-semibold disabled:bg-[#F4F4F4] disabled:text-[#3D3D3D] disabled:pointer-events-none"
										disabled={disable || isPending}
										onClick={handleSubmit}
									>
										{isPending ? "Loading..." : "Save"}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default UserSettings;
