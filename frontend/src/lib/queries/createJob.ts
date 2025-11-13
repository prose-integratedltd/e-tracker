import { instance } from "../api";

export interface CreateJobPayload {
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

export interface CreateJobResponse {
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

export const createJob = async (
  data: CreateJobPayload
): Promise<CreateJobResponse> => {
  const response = await instance.post<CreateJobResponse>("/jobs", data);
  return response.data;
};
