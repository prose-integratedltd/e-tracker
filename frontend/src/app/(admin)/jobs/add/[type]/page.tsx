"use client";

import ParkingAndMovingForm from "@/app/component/job/forms/PackingAndMovingForm";
import CustomClearanceForm from "@/app/component/job/forms/CustomClearanceForm";
import TransportationForm from "@/app/component/job/forms/TransportationForm";
import { JobType, useJobType } from "@/hooks/queries/useFetchJobTypes";
import DashboardHead from "@/app/component/dashboard/DashboardHead";
import WarehouseForm from "@/app/component/job/forms/WarehouseForm";
import { getCreateJobHandler, JobTypeId } from "@/hooks/job/job.handler";
import CarHireForm from "@/app/component/job/forms/CarHireForm";
import BackIconButton from "@/app/component/icons/back.icon";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { JobError } from "@/dto/job.error";

const CreateJobPage = () => {
	const { type: typeId } = useParams();
	const { showToast } = useToast();
	const router = useRouter();

	const { data: type, isLoading } = useJobType(typeId as string);
	const handler = getCreateJobHandler(typeId as JobTypeId);
	const { mutate, isPending } = handler?.useMutationHook();

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const data = Object.fromEntries(formData.entries());

		if (
			data["pickupLocation.address"] &&
			data["pickupLocation.latitude"] &&
			data["pickupLocation.longitude"]
		) {
			data.pickupLocation = JSON.stringify({
				address: data["pickupLocation.address"],
				longitude: Number(data["pickupLocation.longitude"]),
				latitude: Number(data["pickupLocation.latitude"]),
			});
		}

		if (
			data["packingLocation.address"] &&
			data["packingLocation.latitude"] &&
			data["packingLocation.longitude"]
		) {
			data.packingLocation = JSON.stringify({
				address: data["packingLocation.address"],
				longitude: Number(data["packingLocation.longitude"]),
				latitude: Number(data["packingLocation.latitude"]),
			});
		}

		if (
			data["deliveryLocation.address"] &&
			data["deliveryLocation.latitude"] &&
			data["deliveryLocation.longitude"]
		) {
			data.deliveryLocation = JSON.stringify({
				address: data["deliveryLocation.address"],
				longitude: Number(data["deliveryLocation.longitude"]),
				latitude: Number(data["deliveryLocation.latitude"]),
			});
		}

		if (
			data["dropOffLocation.address"] &&
			data["dropOffLocation.latitude"] &&
			data["dropOffLocation.longitude"]
		) {
			data.dropOffLocation = JSON.stringify({
				address: data["dropOffLocation.address"],
				longitude: Number(data["dropOffLocation.longitude"]),
				latitude: Number(data["dropOffLocation.latitude"]),
			});
		}

		if (
			data["moreLocations.address"] &&
			data["moreLocations.latitude"] &&
			data["moreLocations.longitude"]
		) {
			data.moreLocations = JSON.stringify({
				address: data["moreLocations.address"],
				longitude: Number(data["moreLocations.longitude"]),
				latitude: Number(data["moreLocations.latitude"]),
			});
		}

		if (!handler) return showToast("Unsupported job type", "error");

		try {
			const jobInstance = handler.createJobInstance({
				...data,
				typeId: typeId as string,
			});

			mutate(jobInstance, {
				onSuccess: (data) => {
					showToast("Job created successfully", "success");
					router.push(`/jobs/edit/${data.id}`);
				},
				onError: (error) => showToast(String(error), "error"),
			});
		} catch (error) {
			if (error instanceof JobError) showToast(error.message, "error");
		}
	};

	return (
		<>
			<DashboardHead name="Jobs" />

			<form
				onSubmit={onSubmit}
				action="/jobs/add/car-hire"
				className="flex flex-col h-[100vh] bg-white font-poppins"
			>
				<div className="flex items-center gap-3 w-full px-4 py-2 sm:px-7 sm:py-4 bg-[#f0f0f0] border-b border-[#CCCCCC] justify-between">
					<div className="flex items-center gap-3">
						<BackIconButton />

						<span className="text-[#1D1D1D] font-semibold">
							New {type?.name} Job
						</span>
					</div>

					<div className="flex gap-3">
						<button
							onClick={(event) => {
								event.preventDefault();
								window.history.back();
							}}
							className="bg-white rounded-lg border border-[#CCCCCC] px-4 py-2 text-sm"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isPending}
							className="bg-[#1E1E1E] rounded-lg px-4 py-2 text-sm text-white disabled:bg-[#1e1e1e4a] disabled:cursor-wait"
						>
							Save
						</button>
					</div>
				</div>

				{type == undefined ? (
					<JobFormError
						message={isLoading ? "Loading..." : "Invalid Job Type"}
					/>
				) : (
					<JobForm type={type} />
				)}
			</form>
		</>
	);
};

export default CreateJobPage;

interface JobFormProps {
	type?: JobType;
	typeId?: string;
	jobId?: string;
}

export const JobFormError = ({ message }: { message: string }) => {
	return (
		<div className="flex justify-center items-center h-[inherit]">
			{message}
		</div>
	);
};

export const JobForm: React.FC<JobFormProps> = ({ jobId, typeId, type }) => {
	switch (type?.id || typeId) {
		case "36b1e6f4-daa1-4620-bd63-d0b744774c4f":
			return <CarHireForm id={jobId} />;

		case "5d0a6862-5ee4-4e1b-a213-8167cef8966d":
			return <CustomClearanceForm id={jobId} />;

		case "699137c4-c67c-4b90-ab71-d1d7e45911ac":
			return <ParkingAndMovingForm id={jobId} />;

		case "9eaca061-4239-4798-a0f7-1926d5e084c6":
			return <TransportationForm id={jobId} />;

		case "eb0d3b74-1c35-42b0-8264-2bc4fc0bdc1a":
			return <WarehouseForm id={jobId} />;

		default:
			return <JobFormError message="Unimplemented form" />;
	}
};
