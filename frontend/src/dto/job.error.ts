export class JobError {
	typeId?: string;
	name?: string;
	description?: string;
	status?: string;
	date?: string;
	goodsName?: string;
	vehicleType?: string;
	clientName?: string;
	passenger?: string;
	pickupLocation?: string;
	dropOffLocation?: string;
	destinationLocation?: string;
	items?: string[];
	customsCode?: string;
	cargoWeight?: number;
	warehouseId?: string;
	warehouseName?: string;
	warehouseSize?: string;
	movementType?: string;
	packingLocation?: string;
	moreLocations?: string;
	deliveryLocation?: string;
	shipmentType?: string;
	carServiceType?: string;

	goodsType?: string;
	clearingType?: string;
	stateAvailableDocumentations?: string;

	transportSystem?: string;
	transportMode?: string;
	driverName?: string;
	driverPhoneNumber?: string;
	driverLicense?: string;
	driverDateOfBirth?: string;

	serviceType?: string;
	duration?: string;
	customsAgency?: string;
	packagingType?: string;
	distance?: string;
	pickupDate?: string;
	scheduledOperationDate?: string;

	// Status Update
	jobId?: string;
	header?: string;
	completed?: string;
	location?: string;
	time?: string;

	constructor(data?: Partial<JobError>) {
		if (data) Object.assign(this, data);
	}

	copyWith(data: Partial<JobError>): JobError {
		return new JobError({ ...this, ...data });
	}

	get message(): string {
		const parts = [
			this.typeId && this.typeId,
			this.name && this.name,
			this.carServiceType && this.carServiceType,
			this.description && this.description,
			this.status && this.status,
			this.date && this.date,
			this.goodsName && this.goodsName,
			this.vehicleType && this.vehicleType,
			this.clientName && this.clientName,
			this.passenger && this.passenger,
			this.pickupLocation && this.pickupLocation,
			this.dropOffLocation && this.dropOffLocation,
			this.destinationLocation && this.destinationLocation,
			this.items && this.items.join(", "),
			this.customsCode && this.customsCode,
			this.cargoWeight !== undefined && this.cargoWeight,
			this.movementType && this.movementType,
			this.warehouseId && this.warehouseId,
			this.warehouseSize && this.warehouseSize,
			this.warehouseName && this.warehouseName,
			this.serviceType && this.serviceType,
			this.duration && this.duration,
			this.packingLocation && this.packingLocation,
			this.deliveryLocation && this.deliveryLocation,
			this.shipmentType && this.shipmentType,
			this.goodsType && this.goodsType,
			this.clearingType && this.clearingType,
			this.stateAvailableDocumentations &&
				this.stateAvailableDocumentations,
			this.moreLocations && this.moreLocations,
			this.customsAgency && this.customsAgency,
			this.packagingType && this.packagingType,
			this.distance && this.distance,
			this.pickupDate && this.pickupDate,
			this.scheduledOperationDate && this.scheduledOperationDate,
			this.transportSystem && this.transportSystem,
			this.transportMode && this.transportMode,
			this.driverName && this.driverName,
			this.driverPhoneNumber && this.driverPhoneNumber,
			this.driverLicense && this.driverLicense,
			this.driverDateOfBirth && this.driverDateOfBirth,

			this.jobId && this.jobId,
			this.header && this.header,
			this.completed && this.completed,
			this.location && this.location,
			this.time && this.time,
		].filter(Boolean);

		return parts.length > 0
			? parts.join("</br> ")
			: "UnifiedJobError: Unknown errors";
	}
}
