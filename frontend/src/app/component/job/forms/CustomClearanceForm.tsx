import JobSelectInput from "../JobSelectInput";
import JobStatus from "@/app/data/job.status";
import JobInput from "../JobInput";
import { useJob } from "@/hooks/queries/useFetchJobDetails";

interface CustomClearanceForm {
	id?: string;
}

const CustomClearanceForm: React.FC<CustomClearanceForm> = ({ id }) => {
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
				id="type-of-shipment *"
				name="shipmentType"
				label="Type of Shipment *"
				defaultValue={job?.shipmentType}
			/>

			<JobInput
				id="client-name"
				name="clientName"
				defaultValue={job?.clientName}
				label="Client Name or Company Name *"
			/>

			<JobInput
				id="Type of goods to be cleared"
				name="goodsType"
				defaultValue={job?.goodsType}
				label="Type of goods to be cleared *"
			/>

			<JobInput
				id="date"
				name="date"
				type="date"
				label="Date *"
				defaultValue={job?.date}
			/>

			<JobSelectInput
				id="Type Clearing to be done"
				name="clearingType"
				label="Type Clearing to be done *"
				defaultValue={job?.carServiceType}
				option={[
					{
						option: "Sea Port",
						value: "Sea Port",
					},
					{
						option: "Air Port",
						value: "Air Port",
					},
				]}
			/>

			<JobInput
				id="State Available Documentations"
				name="stateAvailableDocumentations"
				label="State Available Documentations *"
				defaultValue={job?.stateAvailableDocumentations}
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

export default CustomClearanceForm;
