import { useToast } from "@/context/ToastContext";
import {
	UpdateJobStatusUpdate,
	useUpdateJobStatusUpdate,
} from "@/hooks/mutations/useUpdateJobStatusUpdate";
import { JobStatusUpdate } from "@/hooks/queries/useFetchJobStatusUpdates";
import { formatDate } from "@/lib/functions/format.date";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";

const StatusUpdateTile = ({
	status,
	headerClassName,
	showCheckBoxes = false,
}: {
	headerClassName?: string;
	status: JobStatusUpdate;
	showCheckBoxes?: boolean;
}) => {
	const { mutate: update } = useUpdateJobStatusUpdate();
	const { showToast } = useToast();

	const [formData, setFormData] = useState<UpdateJobStatusUpdate>({
		id: status.id!,
		completed: status.completed ?? false,
	});

	const onSuccess = ({ completed }: JobStatusUpdate) => {
		showToast(
			`Marked as ${completed ? "completed" : "uncompleted"}`,
			"success"
		);
	};

	const onError = (error: Error) => {
		setFormData((prevData) => ({
			...prevData,
			completed: !prevData.completed,
		}));

		if (
			axios.isAxiosError(error) &&
			Array.isArray(error.response?.data.message)
		) {
			return showToast(
				Array.from(error.response?.data.message).join("</br>"),
				"error"
			);
		}

		return showToast(error.message, "error");
	};

	function onChanged(event: ChangeEvent<HTMLInputElement>): void {
		if (event.target.getAttribute("type") !== "checkbox") return;

		setFormData((prevData) => ({
			...prevData,
			completed: event.target.checked,
		}));

		update(
			{
				...formData,
				completed: event.target.checked,
			},
			{
				onSuccess: onSuccess,
				onError: onError,
			}
		);
	}

	return (
		<div
			key={status.id}
			className="vertical-line relative flex items-center justify-between"
		>
			<div className="flex items-center gap-4 relative">
				<div
					className={`w-2.5 h-2.5 rounded-full ${
						formData.completed ? "bg-[#FF8D24]" : "bg-[#D9D9D9]"
					} mt-1`}
				></div>

				<div className="flex-1">
					<p className="text-sm text-[#979797]">
						{status.date && formatDate(status.date)}

						<span className="pl-5">{status.time}</span>
					</p>
					<p className={headerClassName}>{status?.title}</p>
					<p className="">{status?.description}</p>
				</div>
			</div>

			{showCheckBoxes && (
				<input
					type="checkbox"
					checked={formData.completed}
					onChange={onChanged}
				/>
			)}
		</div>
	);
};

export default StatusUpdateTile;
