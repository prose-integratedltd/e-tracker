import { TransportationStatusUpdateDto } from "@/dto/transportation.status.update.dto";
import { useCreateJobStatusUpdate } from "@/hooks/mutations/useCreateJobStatusUpdate";
import { useFetchJobStatusUpdates } from "@/hooks/queries/useFetchJobStatusUpdates";
import { StatusUpdateDto } from "@/dto/status.update.dto";
import StatusUpdateTile from "../StatusUpdateTile";
import { useToast } from "@/context/ToastContext";
import { JobError } from "@/dto/job.error";
import JobInput from "../JobInput";
import { FormEvent } from "react";
import JobReview from "../JobReview";

interface StatusUpdateFormProps {
	id: string;
	isTransportation: boolean;
}

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({
	id,
	isTransportation = false,
}) => {
	const { mutate, isPending } = useCreateJobStatusUpdate();
	const { data: statuses } = useFetchJobStatusUpdates(id);
	const statusesIsEmpty = (statuses?.length ?? 0) < 1;
	const { showToast } = useToast();

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const data = Object.fromEntries(formData.entries());

		if (
			data["location.address"] &&
			data["location.latitude"] &&
			data["location.longitude"]
		) {
			data.location = JSON.stringify({
				address: data["location.address"],
				longitude: Number(data["location.longitude"]),
				latitude: Number(data["location.latitude"]),
			});
		}

		try {
			const job = isTransportation
				? new TransportationStatusUpdateDto({ jobId: id, ...data })
				: new StatusUpdateDto({ jobId: id, ...data });

			mutate(job, {
				onError: (error) => showToast(error.message, "error"),
				onSuccess: () => {
					event.currentTarget?.reset();
					showToast("Status update created", "success");
				},
			});
		} catch (error) {
			if (error instanceof JobError) showToast(error.message, "error");
			console.log(error);
		}
	};

	return (
		<form onSubmit={onSubmit} className="p-4 sm:p-7 flex flex-col gap-6">
			<div className="p-4 font-semibold bg-[#F2F2F2]">Status Update</div>

			<div className="max-w-full flex flex-col gap-6">
				<div className="flex flex-wrap items-stretch gap-x-20 gap-y-6">
					<JobInput
						id="Time"
						name="time"
						label="Time *"
						type="time"
					/>

					<JobInput
						id="date"
						name="date"
						label="Date *"
						type="date"
					/>

					<JobInput id="title" name="title" label="Title *" />

					<JobInput
						multiline
						id="description"
						name="description"
						label="Description"
					/>
				</div>

				{isTransportation && (
					<JobInput
						id="location"
						name="location"
						autoCompleteLocation
						label="Location *"
					/>
				)}

				<div className="flex items-center gap-2">
					<input id="completed" name="completed" type="checkbox" />

					<label htmlFor="completed" className="text-sm">
						Mark as Completed
					</label>
				</div>

				<div>
					<button
						type="submit"
						disabled={isPending}
						className="bg-[#1E1E1E] rounded-lg px-4 py-2 text-sm text-white disabled:bg-[#1e1e1e4a] disabled:cursor-wait"
					>
						Update
					</button>
				</div>

				{!statusesIsEmpty && (
					<div className="w-full mt-6 pt-4">
						<h2 className="font-semibold text-[#1D1D1D] p-3 mb-6 border-b">
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
				)}

				<JobReview jobId={id} />
			</div>
		</form>
	);
};

export default StatusUpdateForm;
