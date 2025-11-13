import { instance } from "@/lib/api";
import { getJob } from "@/lib/queries/getJob";
import { useQuery } from "@tanstack/react-query";
import JobStatus from "@/app/data/job.status";
import { JobType } from "./useFetchJobTypes";
import { Address } from "@/dto/address";
import { JobStatusUpdate } from "./useFetchJobStatusUpdates";

export const useFetchJobDetails = (id: string) => {
	return useQuery({
		queryKey: ["job", id],
		queryFn: () => getJob(id),
		staleTime: 1000 * 60 * 5,
		retry: 2,
	});
};

export const useJob = (id?: string) => {
	return useQuery({
		queryKey: [id],
		queryFn: async () => {
			if (!id) return null;
			const response = await instance.get<JobModel>(`/jobs/${id}`);
			return response?.data;
		},
		staleTime: 1000 * 60 * 5,
		retry: 2,
	});
};

export interface JobModel {
	id: string;
	jId: string;
	name: string;
	typeId: string;
	type: JobType; // You should define or import this interface
	clientName: string;
	passenger: string;
	status: JobStatus;
	statusUpdates: JobStatusUpdate[];
	date?: string;

	// Custom Clearance, Warehouse and Transportation
	goodsType?: string;

	// Packing & moving and Transport
	moreLocations?: Address;
	deliveryLocation?: Address;

	// Car Hire only
	vehicleType?: string;
	carServiceType?: string;

	// Custom Clearance only
	shipmentType?: string;
	clearingType?: string;
	stateAvailableDocumentations?: string;

	// Packing and Moving
	movementType?: string;
	packingLocation?: Address;

	// Transportation only
	transportMode?: string;
	transportSystem?: string;
	pickupLocation?: Address;
	dropOffLocation?: Address;
	driverName?: string;
	driverPhoneNumber?: string;
	driverLicense?: string;
	driverDateOfBirth?: string;

	// Warehouse only
	warehouseSize?: string;
	scheduledOperationDate?: string;
	goodsName?: string;
	duration?: string;

	description?: string;
	progress?: number;

	updatedAt?: string; // If you're using JS Date, change to `Date`
	createdAt: string;
}
