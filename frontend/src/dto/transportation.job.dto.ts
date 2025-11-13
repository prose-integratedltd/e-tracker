import "reflect-metadata";
import { plainToInstance, Type } from "class-transformer";
import JobStatus from "@/app/data/job.status";
import {
	IsEnum,
	IsUUID,
	IsString,
	IsNotEmpty,
	IsOptional,
	IsDateString,
	validateSync,
	ValidationError,
	ValidateNested,
	IsObject,
} from "class-validator";
import { JobError } from "./job.error";
import { Address } from "./address";

export enum TransportMode {
	Land,
	Air,
	Sea,
}

export class TransportationJob {
	@IsUUID()
	@IsNotEmpty({ message: "Job type is required" })
	typeId?: string;

	@IsString()
	@IsNotEmpty({ message: "Title is required" })
	name?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsNotEmpty({ message: "Client name is required" })
	clientName?: string;

	@IsEnum(JobStatus)
	status: JobStatus = JobStatus.Open;

	@IsNotEmpty({ message: "Date is required" })
	@IsDateString()
	date?: string;

	@IsString()
	@IsNotEmpty({ message: "Goods type is required" })
	goodsType?: string;

	@IsNotEmpty({ message: "Transport Mode is required" })
	@IsEnum(TransportMode)
	transportMode?: TransportMode = TransportMode.Air;

	@IsString()
	@IsNotEmpty({
		message: "Transport system is required",
	})
	transportSystem?: string;

	@IsObject()
	@IsNotEmpty({ message: "Pickup location is required" })
	@ValidateNested()
	@Type(() => Address)
	pickupLocation?: Address | string;

	@IsObject()
	@IsOptional()
	@ValidateNested()
	@Type(() => Address)
	moreLocations?: Address;

	@IsObject()
	@IsNotEmpty({ message: "Delivery location is required" })
	@ValidateNested()
	@Type(() => Address)
	deliveryLocation?: Address | string;

	@IsString()
	@IsNotEmpty({
		message: "Driver name is required",
	})
	driverName?: string;

	@IsString()
	@IsNotEmpty({
		message: "Driver phoneNumber is required",
	})
	driverPhoneNumber?: string;

	@IsString()
	@IsNotEmpty({
		message: "Driver license is required",
	})
	driverLicense?: string;

	@IsString()
	@IsNotEmpty({
		message: "Driver date of birth is required",
	})
	driverDateOfBirth?: string;

	toObject() {
		const entries = Object.entries(this).map(([key, value]) => {
			if (
				value &&
				typeof value === "object" &&
				"toObject" in value &&
				typeof value.toObject === "function"
			) {
				return [key, value.toObject()];
			}
			return [key, value];
		});
		return Object.fromEntries(entries);
	}

	constructor(data?: Partial<TransportationJob>) {
		if (data) {
			if (
				typeof data.pickupLocation === "string" &&
				data.pickupLocation
			) {
				data.pickupLocation = JSON.parse(data.pickupLocation);
			}

			if (
				typeof data.deliveryLocation === "string" &&
				data.deliveryLocation
			) {
				data.deliveryLocation = JSON.parse(data.deliveryLocation);
			}

			if (typeof data.moreLocations === "string" && data.moreLocations) {
				data.moreLocations = JSON.parse(data.moreLocations);
			}

			data = Object.fromEntries(
				Object.entries(data).filter(([key]) => {
					return (
						!key.startsWith("pickupLocation.") &&
						!key.startsWith("deliveryLocation.") &&
						!key.startsWith("moreLocations.")
					);
				})
			);

			const instance = plainToInstance(TransportationJob, data);
			const errors = validateSync(instance, {
				whitelist: true,
				forbidNonWhitelisted: true,
			});

			if (errors.length > 0) throw formatValidationErrors(errors);

			Object.assign(this, instance);
		}
	}
}

function formatValidationErrors(errors: ValidationError[]): JobError {
	let formatted: JobError = new JobError();

	console.log(errors);

	for (const error of errors) {
		if (error.constraints) {
			formatted = formatted.copyWith({
				[error.property]: Object.values(error.constraints)[0],
			});
		}

		if (error.children && error.children.length > 0) {
			const childErrors = formatValidationErrors(error.children);
			for (const [childKey, message] of Object.entries(childErrors)) {
				formatted = formatted.copyWith({
					[`${error.property}.${childKey}`]: message,
					...formatted,
				});
			}
		}
	}

	return formatted;
}
