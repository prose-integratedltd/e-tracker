import JobSelectInput from "../JobSelectInput";
import JobStatus from "@/app/data/job.status";
import JobInput from "../JobInput";
import { useJob } from "@/hooks/queries/useFetchJobDetails";

interface ParkingAndMovingFormProps {
	id?: string;
}

const ParkingAndMovingForm: React.FC<ParkingAndMovingFormProps> = ({ id }) => {
	const { data: job } = useJob(id);

	return (
		<div className="p-4 sm:p-7 flex flex-wrap items-stretch gap-x-32 gap-y-6">
			{job?.jId && (
				<JobInput label="Job ID" readOnly defaultValue={job?.jId} />
			)}

			<JobInput
				id="title"
				name="name"
				label="Title *"
				defaultValue={job?.name}
			/>

			<JobInput
				name="movementType"
				id="Type of Movement"
				label="Type of Movement *"
				defaultValue={job?.movementType}
			/>

			<JobInput
				id="client-name"
				name="clientName"
				label="Client Name or Company Name *"
				defaultValue={job?.clientName}
			/>

			<JobInput
				autoCompleteLocation
				id="Packing Location"
				name="packingLocation"
				label="Packing Location *"
				defaultValue={job?.packingLocation?.address}
				defaultLatitudeValue={job?.packingLocation?.latitude}
				defaultLongitudeValue={job?.packingLocation?.longitude}
			/>

			<JobInput
				id="data"
				type="date"
				name="date"
				label="Date *"
				defaultValue={job?.date}
			/>

			<JobInput
				autoCompleteLocation
				id="Delivery Location"
				name="deliveryLocation"
				label="Delivery Location *"
				defaultValue={job?.deliveryLocation?.address}
				defaultLatitudeValue={job?.deliveryLocation?.latitude}
				defaultLongitudeValue={job?.deliveryLocation?.longitude}
			/>

			<JobInput
				name="moreLocations"
				autoCompleteLocation
				id="Kindly Indicate if more than One location"
				label="Kindly Indicate if more than One location"
				defaultValue={job?.moreLocations?.address}
				defaultLatitudeValue={job?.moreLocations?.latitude}
				defaultLongitudeValue={job?.moreLocations?.longitude}
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
				label="Description"
				defaultValue={job?.description}
			/>
		</div>
	);
};

export default ParkingAndMovingForm;
