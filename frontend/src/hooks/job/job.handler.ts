import {
	useCreateWarehouse,
	useUpdateWarehouse,
	useCreateCarHireJob,
	useUpdateCarHireJob,
	useCreateTransportation,
	useUpdateTransportation,
	useUpdateCustomClearance,
	useCreateCustomClearance,
	useCreatePackingAndMoving,
	useUpdatePackingAndMoving,
} from "../mutations/useCreateJob";
import { PackingAndMovingJob } from "@/dto/packing.and.moving.job.dto";
import { CustomClearanceJob } from "@/dto/car.custom.clearance.dto";
import { TransportationJob } from "@/dto/transportation.job.dto";
import { UseMutateFunction } from "@tanstack/react-query";
import { WarehouseJob } from "@/dto/warehouse.job.dto";
import { CarHireJob } from "@/dto/car.hire.job.dto";
import { JobModel } from "../queries/useFetchJobDetails";

type JobCreateHandler<T extends JobTypeId> = {
	createJobInstance: (data: {
		[k: string]: FormDataEntryValue;
	}) => JobTypeMap[T];
	useMutationHook: () => {
		mutate: UseMutateFunction<JobModel, Error, JobTypeMap[T], unknown>;
		isPending: boolean;
	};
};

type JobEditHandler<T extends JobTypeId> = {
	createJobInstance: (data: {
		[k: string]: FormDataEntryValue;
	}) => JobTypeMap[T];
	useMutationHook: () => {
		mutate: UseMutateFunction<
			JobModel,
			Error,
			{
				id: string;
				payload: JobTypeMap[T];
			},
			unknown
		>;
		isPending: boolean;
	};
};

const JOB_TYPE_HANDLERS_CREATE: {
	[K in JobTypeId]: JobCreateHandler<K>;
} = {
	"36b1e6f4-daa1-4620-bd63-d0b744774c4f": {
		createJobInstance: (data) => new CarHireJob(data),
		useMutationHook: useCreateCarHireJob,
	},
	"5d0a6862-5ee4-4e1b-a213-8167cef8966d": {
		createJobInstance: (data: { [k: string]: FormDataEntryValue }) => {
			return new CustomClearanceJob(data);
		},
		useMutationHook: useCreateCustomClearance,
	},
	"699137c4-c67c-4b90-ab71-d1d7e45911ac": {
		createJobInstance: (data: { [k: string]: FormDataEntryValue }) => {
			return new PackingAndMovingJob(data);
		},
		useMutationHook: useCreatePackingAndMoving,
	},
	"9eaca061-4239-4798-a0f7-1926d5e084c6": {
		createJobInstance: (data: { [k: string]: FormDataEntryValue }) => {
			return new TransportationJob(data);
		},
		useMutationHook: useCreateTransportation,
	},
	"eb0d3b74-1c35-42b0-8264-2bc4fc0bdc1a": {
		createJobInstance: (data: { [k: string]: FormDataEntryValue }) => {
			return new WarehouseJob(data);
		},
		useMutationHook: useCreateWarehouse,
	},
} as const;

const JOB_TYPE_HANDLERS_EDIT: {
	[K in JobTypeId]: JobEditHandler<K>;
} = {
	"36b1e6f4-daa1-4620-bd63-d0b744774c4f": {
		createJobInstance: (data) => new CarHireJob(data),
		useMutationHook: useUpdateCarHireJob,
	},
	"5d0a6862-5ee4-4e1b-a213-8167cef8966d": {
		createJobInstance: (data) => new CustomClearanceJob(data),
		useMutationHook: useUpdateCustomClearance,
	},
	"699137c4-c67c-4b90-ab71-d1d7e45911ac": {
		createJobInstance: (data) => new PackingAndMovingJob(data),
		useMutationHook: useUpdatePackingAndMoving,
	},
	"9eaca061-4239-4798-a0f7-1926d5e084c6": {
		createJobInstance: (data) => new TransportationJob(data),
		useMutationHook: useUpdateTransportation,
	},
	"eb0d3b74-1c35-42b0-8264-2bc4fc0bdc1a": {
		createJobInstance: (data) => new WarehouseJob(data),
		useMutationHook: useUpdateWarehouse,
	},
} as const;

type JobTypeMap = {
	"36b1e6f4-daa1-4620-bd63-d0b744774c4f": CarHireJob;
	"5d0a6862-5ee4-4e1b-a213-8167cef8966d": CustomClearanceJob;
	"699137c4-c67c-4b90-ab71-d1d7e45911ac": PackingAndMovingJob;
	"9eaca061-4239-4798-a0f7-1926d5e084c6": TransportationJob;
	"eb0d3b74-1c35-42b0-8264-2bc4fc0bdc1a": WarehouseJob;
};

export type JobTypeId = keyof JobTypeMap;

export function getCreateJobHandler<T extends JobTypeId>(
	typeId: T
): JobCreateHandler<T> {
	return JOB_TYPE_HANDLERS_CREATE[typeId];
}

export function getEditJobHandler<T extends JobTypeId>(
	typeId: T
): JobEditHandler<T> {
	return JOB_TYPE_HANDLERS_EDIT[typeId];
}
