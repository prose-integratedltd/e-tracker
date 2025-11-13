import "reflect-metadata";
import { plainToInstance, Type } from "class-transformer";
import JobStatus from "@/app/data/job.status";
import {
	IsEnum,
	IsUUID,
	IsString,
	IsObject,
	IsNotEmpty,
	IsOptional,
	IsDateString,
	validateSync,
	ValidationError,
	ValidateNested,
} from "class-validator";
import { JobError } from "./job.error";
import { Address } from "./address";

export class PackingAndMovingJob {
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
	@IsNotEmpty({ message: "Client/Company name is required" })
	clientName?: string;

	@IsDateString()
	@IsNotEmpty({ message: "Date is required" })
	date?: string;

	@IsString()
	@IsNotEmpty({ message: "Movement type (movementType) is required" })
	movementType?: string;

	@IsObject()
	@ValidateNested()
	@Type(() => Address)
	packingLocation?: Address;

	@IsObject()
	@IsOptional()
	@ValidateNested()
	@Type(() => Address)
	moreLocations?: Address;

	@IsObject()
	@ValidateNested()
	@Type(() => Address)
	deliveryLocation?: Address;

	@IsEnum(JobStatus)
	status: JobStatus = JobStatus.Open;

	constructor(data?: Partial<PackingAndMovingJob>) {
		if (data) {
			if (
				typeof data.packingLocation === "string" &&
				data.packingLocation
			) {
				data.packingLocation = JSON.parse(data.packingLocation);
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
						!key.startsWith("packingLocation.") &&
						!key.startsWith("deliveryLocation.") &&
						!key.startsWith("moreLocations.")
					);
				})
			);

			const instance = plainToInstance(PackingAndMovingJob, data);
			const errors = validateSync(instance, {
				whitelist: true,
				forbidNonWhitelisted: true,
			});

			if (errors.length > 0) throw formatValidationErrors(errors);

			Object.assign(this, instance);
		}
	}

	toObject() {
		return {
			typeId: this.typeId,
			name: this.name,
			description: this.description,
			clientName: this.clientName,
			date: this.date,
			movementType: this.movementType,
			packingLocation: this.packingLocation,
			moreLocations: this.moreLocations,
			deliveryLocation: this.deliveryLocation,
			status: this.status,
		};
	}
}

function formatValidationErrors(errors: ValidationError[]): JobError {
	let formatted: JobError = new JobError();

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
