"use client";

import { useToast } from "@/context/ToastContext";
import {
	CreateJobStatusUpdate,
	useCreateJobStatusUpdate,
} from "@/hooks/mutations/useCreateJobStatusUpdate";
import { useFetchJobStatusUpdates } from "@/hooks/queries/useFetchJobStatusUpdates";
import axios from "axios";
import React, { useState, ChangeEvent, FormEvent } from "react";
import GoogleMapView from "../GoogleMapView";
import AutocompleteGooglePlace from "../AutocompleteGooglePlace";
import StatusUpdateTile from "../../job/StatusUpdateTile";
import CloseIcon from "@/app/component/icons/close.icon";

type UpdateStatusProps = {
	onClosed: () => void;
	id: string;
};

const UpdateStatusModal: React.FC<UpdateStatusProps> = ({ onClosed, id }) => {
	const [address, setAddress] = useState<string>();
	const [formData, setFormData] = useState<CreateJobStatusUpdate>({
		jobId: id,
	});
	const { mutate: create, isPending } = useCreateJobStatusUpdate();
	const { data: statuses } = useFetchJobStatusUpdates(id);
	const [showMap, setShowMap] = useState(false);
	const [position, setPosition] = useState<{
		latitude: number;
		longitude: number;
	}>();

	const { showToast } = useToast();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.getAttribute("type") === "checkbox") {
			const { name, checked } = e.target;

			return setFormData((prevData) => ({
				...prevData,
				[name]: checked,
			}));
		}

		const { name, value } = e.target;

		return setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();

		create(
			{
				...formData,
				date: formData.date && new Date(formData.date).toISOString(),
			},
			{
				onSuccess: () => {
					showToast("Status updated successfully", "success");
					onClosed();
				},
				onError: (error) => {
					if (
						axios.isAxiosError(error) &&
						Array.isArray(error.response?.data.message)
					) {
						return showToast(
							Array.from(error.response?.data.message).join(
								"</br>"
							),
							"error"
						);
					}

					return showToast(error.message, "error");
				},
			}
		);
	};

	const handleLocationError = (error: GeolocationPositionError) => {
		if (error["PERMISSION_DENIED"]) {
			return showToast("Location permission denied by the OS", "error");
		}

		if (error["POSITION_UNAVAILABLE"]) {
			return showToast("Location not available", "error");
		}

		return showToast(error.message, "error");
	};

	const getCurrentLocation = () => {
		if (!navigator.geolocation) {
			return showToast(
				"Geolocation is not supported by this browser.",
				"error"
			);
		}

		navigator.geolocation.getCurrentPosition(
			({ coords: { latitude, longitude } }) => {
				setShowMap(true);
				setPosition({ latitude, longitude });
			},

			handleLocationError
		);
	};

	function handleDescriptionChanged(
		event: ChangeEvent<HTMLTextAreaElement>
	): void {
		setFormData((prevData) => ({
			...prevData,
			description: event.target.value,
		}));
	}

	function onBackgroundClicked(): void {
		if (showMap) return setShowMap(false);

		return onClosed();
	}

	return (
		<div
			className="w-full h-screen flex items-center justify-center fixed top-0 left-0 z-40 bg-black bg-opacity-75"
			onClick={onBackgroundClicked}
		>
			<div
				className="bg-white w-[700px] h-[95vh] min-[1500px]:h-[700px] p-5 rounded-lg overflow-auto"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="p-7 w-full">
					<div className="w-full flex items-center justify-between">
						<span className="text-[#1D1D1D] font-semibold text-xl">
							Status Update
						</span>
						<button onClick={onClosed}>
							<CloseIcon />
						</button>
					</div>

					<form className="mt-7 w-full" onSubmit={onSubmit}>
						<div className="flex w-full justify-between gap-10">
							<div className="flex flex-col gap-2 w-full">
								<label className="text-sm font-medium text-[#6C757D]">
									Time
									<span className="text-[#FF3030]">*</span>
								</label>
								<input
									name="time"
									type="time"
									required
									className="w-full h-[54px] rounded-lg border px-3 outline-none"
									onChange={handleChange}
								/>
							</div>

							<div className="flex flex-col gap-2 w-full">
								<label className="text-sm font-medium text-[#6C757D]">
									Date
									<span className="text-[#FF3030]">*</span>
								</label>
								<input
									name="date"
									type="date"
									required
									className="w-full h-[54px] rounded-lg border px-3 outline-none"
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2 w-full mt-3">
							<label className="text-sm font-medium text-[#6C757D]">
								Title
								<span className="text-[#FF3030]">*</span>
							</label>
							<input
								type="text"
								name="header"
								onChange={handleChange}
								required
								className="w-full h-[54px] rounded-lg border px-3 outline-none"
							/>
						</div>

						<div className="flex flex-col gap-2 w-full mt-3">
							<label className="text-sm font-medium text-[#6C757D]">
								Description
							</label>
							<textarea
								name="description"
								id="description"
								onChange={handleDescriptionChanged}
								className="w-full h-[54px] rounded-lg border px-3 outline-none"
							></textarea>
						</div>

						<div className="mt-3">
							<AutocompleteGooglePlace
								required
								label={
									<label
										htmlFor="location"
										className="text-sm font-medium text-[#6C757D]"
									>
										Location
										<span className="text-[#FF3030]">
											*
										</span>
									</label>
								}
								value={address}
								name="location"
								className="w-full h-[54px] rounded-lg border px-3 outline-none"
								onSelected={(location) =>
									setFormData({ ...formData, location })
								}
							/>
						</div>

						<button
							type="button"
							onClick={getCurrentLocation}
							className="rounded-lg bg-[#1E1E1E] text-sm px-4 py-2 text-white  mt-4"
						>
							Select location on map
						</button>

						<div className="flex items-center gap-2 mt-4">
							<input
								name="completed"
								type="checkbox"
								onChange={handleChange}
							/>

							<label htmlFor="completed" className="text-sm">
								Mark as Completed
							</label>
						</div>

						<div className="flex justify-end mt-6">
							<button
								type="submit"
								disabled={isPending}
								className="w-[104px] h-11 rounded-lg bg-[#1E1E1E] text-white disabled:bg-[#F4F4F4] disabled:text-[#3D3D3D]"
							>
								{isPending ? "Saving..." : "Save"}
							</button>
						</div>
					</form>

					<div className="w-full border-t mt-6 pt-4">
						<h2 className="font-semibold text-[#1D1D1D] mb-3">
							History
						</h2>
						<div className="space-y-4 -vertical-line z-20 relative">
							{Array.isArray(statuses) &&
								statuses.map((status) => (
									<StatusUpdateTile
										key={status.id}
										status={status}
										showCheckBoxes={true}
									/>
								))}
						</div>
					</div>
				</div>
			</div>

			{showMap && position && (
				<div
					className="absolute top-[50%] bottom-0 translate-y-[-50%] md:w-[947px] w-[80%] h-[70vh] z-50"
					onClick={(e) => e.stopPropagation()}
				>
					<GoogleMapView
						canPickLocation={true}
						showActionButton={true}
						showCurrentLocation={true}
						style={{ borderRadius: "20px" }}
						onSelected={({ address, longitude, latitude }) => {
							setFormData({
								...formData,
								location: {
									address: address,
									longitude: longitude,
									latitude: latitude,
								},
							});
							setAddress(address);
							setShowMap(false);
						}}
						coords={{
							lat: position.latitude,
							lng: position.longitude,
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default UpdateStatusModal;
