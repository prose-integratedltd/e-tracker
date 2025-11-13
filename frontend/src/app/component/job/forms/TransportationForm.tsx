import JobSelectInput from "../JobSelectInput";
import JobStatus from "@/app/data/job.status";
import JobInput from "../JobInput";
import { useJob } from "@/hooks/queries/useFetchJobDetails";
import isValidNigerianPlateNumber from "@/helper/plat.number.validator";
import { useState } from "react";

interface TransportationFormProps {
	id?: string;
}

const TransportationForm: React.FC<TransportationFormProps> = ({ id }) => {
	const { data: job } = useJob(id);
	const [plateNumberError, setPlateNumberError] = useState<string>();

	return (
		<div className="p-4 sm:p-7 flex flex-col gap-x-32 gap-y-6">
			<div className="flex flex-wrap items-stretch gap-x-32 gap-y-6">
				{job?.jId && (
					<JobInput
						id="jId"
						label="Job ID"
						readOnly
						defaultValue={job?.jId}
					/>
				)}

				<JobInput
					id="title"
					name="name"
					label="Title *"
					defaultValue={job?.name}
				/>

				<JobInput
					id="Type Of Goods to be transported"
					label="Type Of Goods to be transported *"
					name="goodsType"
					defaultValue={job?.goodsType}
				/>

				<JobInput
					id="client-name"
					name="clientName"
					defaultValue={job?.clientName}
					label="Client Name or Company Name *"
				/>

				<JobSelectInput
					id="Mode of Transportation"
					label="Mode of Transportation"
					name="transportMode"
					defaultValue={job?.transportMode}
					option={[
						{
							value: "Air",
							option: "Air",
						},
						{
							value: "Land",
							option: "Land",
						},
						{
							value: "Sea",
							option: "Sea",
						},
					]}
				/>

				<JobInput
					id="Name of Transportation System"
					name="transportSystem"
					defaultValue={job?.transportSystem}
					label="Name of Transportation System *"
				/>

				<JobInput
					id="Pick up location"
					name="pickupLocation"
					label="Pick up location *"
					autoCompleteLocation
					defaultValue={job?.pickupLocation?.address}
					defaultLongitudeValue={job?.pickupLocation?.longitude}
					defaultLatitudeValue={job?.pickupLocation?.latitude}
				/>

				<JobInput
					id="data"
					type="date"
					name="date"
					label="Date *"
					defaultValue={job?.date}
				/>

				<JobSelectInput
					id="status"
					label="Status"
					name="status"
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
					autoCompleteLocation
					id="Delivery Location"
					name="deliveryLocation"
					label="Delivery Location *"
					defaultValue={job?.deliveryLocation?.address}
					defaultLongitudeValue={job?.deliveryLocation?.longitude}
					defaultLatitudeValue={job?.deliveryLocation?.latitude}
				/>

				<JobInput
					id="Kindly Indicate if more than One location"
					name="moreLocations"
					autoCompleteLocation
					defaultValue={job?.moreLocations?.address}
					label="Kindly Indicate if more than One location"
					defaultLatitudeValue={job?.moreLocations?.latitude}
					defaultLongitudeValue={job?.moreLocations?.longitude}
				/>

				<JobInput
					id="description"
					name="description"
					label="Description"
					multiline
					defaultValue={job?.description}
				/>
			</div>

			<div className="p-4 mt-10 bg-[#F2F2F2]">{"Driver's details"}</div>

			<div className="flex flex-wrap items-stretch gap-x-32 gap-y-6">
				<JobInput
					id="Drivers Name"
					name="driverName"
					label="Driver's Name *"
					defaultValue={job?.driverName}
				/>

				<JobInput
					type="number"
					id="Drivers Phone Number"
					name="driverPhoneNumber"
					label="Driver's Phone Number *"
					defaultValue={job?.driverPhoneNumber}
				/>

				<JobInput
					name="driverLicense"
					autoCapitalize="characters"
					errorText={plateNumberError}
					id="Driver's License Details"
					placeholder="e.g., ABC123456789"
					defaultValue={job?.driverLicense}
					label="Driver's License Details *"
					onChange={(e) => {
						setPlateNumberError(undefined);
						const value = e.target.value;
						if (value && !isValidNigerianPlateNumber(value)) {
							setPlateNumberError(
								"Invalid plate number. Format should be like 'ABC-123XY'"
							);
						}
					}}
				/>

				<JobInput
					type="date"
					id="Date of Birth"
					name="driverDateOfBirth"
					label="Date of Birth"
					defaultValue={job?.driverDateOfBirth}
				/>
			</div>
		</div>
	);
};

export default TransportationForm;
