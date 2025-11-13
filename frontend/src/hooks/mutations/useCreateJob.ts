import {
	QueryClient,
	useMutation,
	useQueryClient,
	UseMutateFunction,
} from "@tanstack/react-query";
import { createJob } from "@/lib/queries/createJob";
import { CarHireJob } from "@/dto/car.hire.job.dto";
import { instance } from "@/lib/api";
import { JobModel } from "../queries/useFetchJobDetails";
import { CustomClearanceJob } from "@/dto/car.custom.clearance.dto";
import { PackingAndMovingJob } from "@/dto/packing.and.moving.job.dto";
import { WarehouseJob } from "@/dto/warehouse.job.dto";
import { TransportationJob } from "@/dto/transportation.job.dto";

export const useCreateJob = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createJob,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] });
		},
	});
};

export const useCreateCarHireJob = (): {
	mutate: UseMutateFunction<JobModel, Error, CarHireJob, unknown>;
	isPending: boolean;
} => {
	const client = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (payload: CarHireJob) => {
			const response = await instance.post<JobModel>(
				"/jobs/car-hire",
				payload
			);
			return response?.data;
		},
		onSuccess: () => onSuccess(client),
	});

	return { mutate: mutation.mutate, isPending: mutation.isPending };
};

export const useUpdateCarHireJob = () => {
	const client = useQueryClient();

	const mutation = useMutation<
		JobModel,
		Error,
		{ id: string; payload: CarHireJob }
	>({
		mutationFn: async ({ id, payload }) => {
			const response = await instance.patch<JobModel>(
				`/jobs/car-hire/${id}`,
				payload
			);
			return response?.data;
		},
		onSuccess: (data) => onSuccess(client, data.id),
	});

	return { mutate: mutation.mutate, isPending: mutation.isPending };
};

export const useCreateCustomClearance = () => {
	const client = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (payload: CustomClearanceJob) => {
			const response = await instance.post<JobModel>(
				"/jobs/custom-clearance",
				payload
			);
			return response?.data;
		},
		onSuccess: () => onSuccess(client),
	});

	return { mutate: mutation.mutate, isPending: mutation.isPending };
};

export const useUpdateCustomClearance = () => {
	const client = useQueryClient();

	const mutation = useMutation<
		JobModel,
		Error,
		{ id: string; payload: CustomClearanceJob }
	>({
		mutationFn: async ({ id, payload }) => {
			const response = await instance.patch<JobModel>(
				`/jobs/custom-clearance/${id}`,
				payload
			);
			return response?.data;
		},
		onSuccess: (data) => onSuccess(client, data.id),
	});

	return { mutate: mutation.mutate, isPending: mutation.isPending };
};

export const useCreatePackingAndMoving = () => {
	const client = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (payload: PackingAndMovingJob) => {
			const response = await instance.post<JobModel>(
				"/jobs/packing-and-moving",
				payload
			);
			return response?.data;
		},
		onSuccess: () => onSuccess(client),
	});

	return { mutate: mutation.mutate, isPending: mutation.isPending };
};

export const useUpdatePackingAndMoving = () => {
	const client = useQueryClient();

	const mutation = useMutation<
		JobModel,
		Error,
		{ id: string; payload: PackingAndMovingJob }
	>({
		mutationFn: async ({ id, payload }) => {
			const response = await instance.patch<JobModel>(
				`/jobs/packing-and-moving/${id}`,
				payload
			);
			return response?.data;
		},
		onSuccess: (data) => onSuccess(client, data.id),
	});

	return { mutate: mutation.mutate, isPending: mutation.isPending };
};

export const useCreateTransportation = () => {
	const client = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (payload: TransportationJob) => {
			const response = await instance.post<JobModel>(
				"/jobs/transportation",
				payload
			);
			return response?.data;
		},
		onSuccess: () => onSuccess(client),
	});

	return { mutate: mutation.mutate, isPending: mutation.isPending };
};

export const useUpdateTransportation = () => {
	const client = useQueryClient();

	const mutation = useMutation<
		JobModel,
		Error,
		{ id: string; payload: TransportationJob }
	>({
		mutationFn: async ({ id, payload }) => {
			const response = await instance.patch<JobModel>(
				`/jobs/transportation/${id}`,
				payload
			);
			return response?.data;
		},
		onSuccess: (data) => onSuccess(client, data.id),
	});

	return { mutate: mutation.mutate, isPending: mutation.isPending };
};

export const useCreateWarehouse = () => {
	const client = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (payload: WarehouseJob) => {
			const response = await instance.post<JobModel>(
				"/jobs/warehouse",
				payload
			);
			return response?.data;
		},
		onSuccess: () => onSuccess(client),
	});

	return { mutate: mutation.mutate, isPending: mutation.isPending };
};

export const useUpdateWarehouse = () => {
	const client = useQueryClient();

	const mutation = useMutation<
		JobModel,
		Error,
		{ id: string; payload: WarehouseJob }
	>({
		mutationFn: async ({ id, payload }) => {
			const response = await instance.patch<JobModel>(
				`/jobs/warehouse/${id}`,
				payload
			);
			return response?.data;
		},
		onSuccess: (data) => onSuccess(client, data.id),
	});

	return { mutate: mutation.mutate, isPending: mutation.isPending };
};

const onSuccess = (client: QueryClient, id?: string) => {
	if (id) client.invalidateQueries({ queryKey: [id] });
	client.invalidateQueries({ queryKey: ["jobs"] });
	client.invalidateQueries({ queryKey: ["notifications"] });
};
