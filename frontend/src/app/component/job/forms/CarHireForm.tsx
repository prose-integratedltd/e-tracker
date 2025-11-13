import JobSelectInput from "../JobSelectInput";
import JobStatus from "@/app/data/job.status";
import JobInput from "../JobInput";
import { useJob } from "@/hooks/queries/useFetchJobDetails";

interface CarHireFormProps {
	id?: string;
}

const CarHireForm: React.FC<CarHireFormProps> = ({ id }) => {
	const { data: job } = useJob(id);

	return (
		<div className="p-4 sm:p-7 flex flex-col gap-6 ">
			<div className="flex flex-wrap items-stretch gap-x-32 gap-y-6">
				{job?.jId && (
					<JobInput label="Job ID" readOnly defaultValue={job?.jId} />
				)}

				<JobInput
					id="title"
					name="name"
					defaultValue={job?.name}
					label="Title *"
				/>

				<JobInput
					id="clientName"
					name="clientName"
					defaultValue={job?.clientName}
					label="Client Name or Company Name *"
				/>

				<JobInput
					id="passenger"
					name="passenger"
					label="Passenger"
					defaultValue={job?.passenger}
				/>

				<JobInput
					id="pickupLocation"
					autoCompleteLocation
					name="pickupLocation"
					label="Pickup location *"
					defaultValue={job?.pickupLocation?.address}
					defaultLatitudeValue={job?.pickupLocation?.latitude}
					defaultLongitudeValue={job?.pickupLocation?.longitude}
				/>

				<JobInput
					autoCompleteLocation
					id="Drop off location"
					name="dropOffLocation"
					label="Drop off location *"
					defaultValue={job?.dropOffLocation?.address}
					defaultLongitudeValue={job?.dropOffLocation?.longitude}
					defaultLatitudeValue={job?.dropOffLocation?.latitude}
				/>

				<JobInput
					id="vehicleType"
					name="vehicleType"
					label="Type of Vehicle *"
					defaultValue={job?.vehicleType}
				/>

				<JobInput
					id="carServiceType"
					name="carServiceType"
					defaultValue={job?.carServiceType}
					label="Type of Car Service *"
				/>

				<JobInput
					id="date"
					name="date"
					type="date"
					label="Date *"
					defaultValue={job?.date}
				/>

				<JobSelectInput
					id="status"
					name="status"
					label="Status"
					defaultValue={job?.status}
					option={[
						{
							option: JobStatus.Open,
							value: JobStatus.Open,
						},
						{
							option: "In Progress",
							value: JobStatus.InProgress,
						},
						{
							option: JobStatus.Completed,
							value: JobStatus.Completed,
						},
						{
							option: JobStatus.Cancelled,
							value: JobStatus.Cancelled,
						},
					]}
				/>

				<JobInput
					multiline
					id="description"
					name="description"
					defaultValue={job?.description}
					label="Description"
				/>
			</div>
		</div>
	);
};

export default CarHireForm;
