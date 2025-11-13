"use client";

import StatusUpdateForm from "@/app/component/job/forms/StatusUpdateForm";
import { getEditJobHandler, JobTypeId } from "@/hooks/job/job.handler";
import { JobModel, useJob } from "@/hooks/queries/useFetchJobDetails";
import DashboardHead from "@/app/component/dashboard/DashboardHead";
import { JobForm, JobFormError } from "../../add/[type]/page";
import BackIconButton from "@/app/component/icons/back.icon";
import { useToast } from "@/context/ToastContext";
import { FormEvent, ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { JobError } from "@/dto/job.error";
import { JobType } from "@/hooks/queries/useFetchJobTypes";

const EditJobPage = () => {
	const { jobId } = useParams();
	const { data: job, isLoading } = useJob(jobId as string);

	if (isLoading && !job) {
		return (
			<PageWrapper>
				<JobFormError message={"Loading..."} />
			</PageWrapper>
		);
	}

	if (!job) {
		return (
			<PageWrapper>
				<JobFormError message={"Job not found"} />
			</PageWrapper>
		);
	}

	return <Form job={job} />;
};

export default EditJobPage;

interface PageWrapperProps {
	children: ReactNode;
	isPending?: boolean;
	jobType?: JobType;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
	isPending,
	jobType,
	children,
}) => {
	const router = useRouter();

	return (
		<div className="flex flex-col">
			<DashboardHead name="Jobs" />
			<div className="flex items-center gap-3 w-full px-4 py-2 sm:px-7 sm:py-4 bg-[#f0f0f0] border-b border-[#CCCCCC] justify-between">
				<div className="flex items-center gap-3">
					<BackIconButton onClick={() => router.replace("/jobs")} />

					<span className="text-[#1D1D1D] font-semibold">
						Edit {jobType?.name} Job
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
						Edit
					</button>
				</div>
			</div>

			{children}
		</div>
	);
};

interface FormProps {
	job: JobModel;
}

const Form: React.FC<FormProps> = ({ job }) => {
	const handler = getEditJobHandler(job.typeId as JobTypeId);
	const { mutate, isPending } = handler?.useMutationHook();
	const { showToast } = useToast();

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const data = Object.fromEntries(formData.entries());

		if (!handler) return showToast("Unsupported job type", "error");

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

		try {
			const jobInstance = handler.createJobInstance({
				...data,
				typeId: job.typeId as string,
			});

			mutate(
				{ id: job.id, payload: jobInstance },
				{
					onSuccess: () => {
						showToast("Job created successfully", "success");
					},
					onError: (error) => showToast(String(error), "error"),
				}
			);
		} catch (error) {
			if (error instanceof JobError) showToast(error.message, "error");
		}
	};

	return (
		<div className="h-[100vh] bg-white font-poppins -z-10">
			<form onSubmit={onSubmit}>
				<PageWrapper jobType={job.type} isPending={isPending}>
					<JobForm typeId={job.typeId} jobId={job.id} />
				</PageWrapper>
			</form>

			<StatusUpdateForm
				id={job.id}
				isTransportation={
					job.typeId == "9eaca061-4239-4798-a0f7-1926d5e084c6"
				}
			/>
		</div>
	);
};
