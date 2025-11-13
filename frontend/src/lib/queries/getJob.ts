import { instance } from "../api";

export const getJob = async (
	id: string
): Promise<{
	id: string;
	jId: string;
	typeId: string;
	name: string;
	transportMode: string;
	clientName: string;
	serviceType: string;
	expectedDeliveryDate: string;
	arrivalTime: string;
	departureTime: string;
	vehicleType: string;
	vehicleColour: string;
	vehicleNumber: string;
	vehicleTannage: string;
	driverName: string;
	driverPhoneNumber: string;
	transportType: string;
	status: string;
	description: string;
}> => {
	const response = await instance.get(`/jobs/${id}`);
	return response.data;
};
