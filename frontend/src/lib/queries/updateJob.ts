import { instance } from "../api";

export interface UpdateJobPayload {
  typeId?: string;
  name?: string;
  status?: string;
  clientName?: string;
  transportMode?: string;
  serviceType?: string;
  expectedDeliveryDate?: string;
  arrivalTime?: string;
  driverPhoneNumber?: string;
  vehicleType?: string;
  vehicleColour?: string;
  vehicleNumber?: string;
  vehicleTannage?: string;
  driverName?: string;
  transportType?: string;
  description?: string;
}

export interface UpdateJobResponse {
  typeId: string;
  name: string;
  status: string;
  clientName: string;
  transportMode: string;
  serviceType: string;
  expectedDeliveryDate: string;
  arrivalTime: string;
  driverPhoneNumber: string;
  vehicleType: string;
  vehicleColour: string;
  vehicleNumber: string;
  vehicleTannage: string;
  driverName: string;
  transportType: string;
  description: string;
}

export const updateJob = async (
  jobId: string,
  data: UpdateJobPayload
): Promise<UpdateJobResponse> => {
  const response = await instance.patch<UpdateJobResponse>(
    `/jobs/${jobId}`,
    data
  );
  return response.data;
};
