import { useJob } from "@/hooks/queries/useFetchJobDetails";
import JobSelectInput from "../JobSelectInput";
import JobStatus from "@/app/data/job.status";
import JobInput from "../JobInput";

interface WarehouseFormProps {
	id?: string;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({ id }) => {
	const { data: job } = useJob(id);

	return (
		<div className="p-4 sm:p-7 flex flex-wrap items-stretch gap-x-20 gap-y-6">
			{job?.jId && (
				<JobInput label="Job ID" readOnly defaultValue={job?.jId} />
			)}

			<JobInput
				id="title"
				name="name"
				defaultValue={job?.name}
				label="Title *"
			/>

			<JobSelectInput
				id="Type Of Goods to be stored"
				label="Type Of Goods to be stored *"
				name="goodsType"
				defaultValue={job?.goodsType}
				multiple
				option={[
					{
						option: "Dry Goods",
						value: "Dry Goods",
					},
					{
						option: "Cold Chain",
						value: "Cold Chain",
					},
				]}
			/>

			<JobInput
				id="client-name"
				name="clientName"
				defaultValue={job?.clientName}
				label="Client Name or Company Name *"
			/>

			<JobInput
				id="Size of Warehouse needed"
				label="Size of Warehouse needed"
				defaultValue={job?.warehouseSize}
				name="warehouseSize"
			/>

			<JobInput
				type="date"
				name="scheduledOperationDate"
				id="Date Of scheduled Operation"
				defaultValue={job?.scheduledOperationDate}
				label="Date Of scheduled Operation *"
			/>

			<JobInput
				name="goodsName"
				id="Name of Goods"
				defaultValue={job?.goodsName}
				label="Name of Goods *"
			/>

			<JobSelectInput
				id="Time Duration"
				label="Time Duration *"
				name="duration"
				defaultValue={job?.duration}
				option={[
					{
						option: "4 weeks",
						value: "4 weeks",
					},
					{
						option: "3 weeks",
						value: "3 weeks",
					},
					{
						option: "2 weeks",
						value: "2 weeks",
					},
					{
						option: "1 weeks",
						value: "1 weeks",
					},
				]}
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
				multiline
				id="description"
				name="description"
				defaultValue={job?.description}
				label="Description"
			/>
		</div>
	);
};

export default WarehouseForm;
