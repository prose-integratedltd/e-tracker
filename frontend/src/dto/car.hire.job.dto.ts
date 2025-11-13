import { plainToInstance, Type } from "class-transformer";
import JobStatus from "@/app/data/job.status";
import {
	IsUUID,
	IsEnum,
	IsString,
	IsNotEmpty,
	IsOptional,
	validateSync,
	IsDateString,
	ValidationError,
	IsObject,
} from "class-validator";
import { JobError } from "./job.error";
import { Address } from "./address";

export class CarHireJob {
	@IsUUID()
	@IsNotEmpty({ message: "Job type is required" })
	typeId?: string;

	@IsString()
	@IsNotEmpty({ message: "Title is required" })
	name?: string;

	@IsObject()
	@Type(() => Address)
	@IsNotEmpty({ message: "Pickup location is required" })
	pickupLocation?: Address;

	@IsObject()
	@Type(() => Address)
	@IsNotEmpty({ message: "Drop off location is required" })
	dropOffLocation?: Address;

	@IsString()
	// @IsIn(["Sedan", "SUV", "Van", "Bus"])
	@IsNotEmpty({ message: "Vehicle Type is required" })
	vehicleType?: string;

	@IsString()
	@IsNotEmpty({ message: "Client/Company name is required" })
	clientName?: string;

	@IsString()
	@IsOptional()
	passenger?: string;

	@IsString()
	@IsNotEmpty({ message: "Car Service Type is required" })
	carServiceType?: string;

	@IsDateString()
	@IsNotEmpty({ message: "Date is required" })
	date?: string;

	@IsNotEmpty({ message: "Status is required" })
	@IsEnum(JobStatus)
	status: JobStatus = JobStatus.Open;

	@IsString()
	@IsOptional()
	description?: string;

	constructor(data?: Partial<CarHireJob>) {
		if (data) {
			if (
				typeof data.pickupLocation === "string" &&
				data.pickupLocation
			) {
				data.pickupLocation = JSON.parse(data.pickupLocation);
			}

			if (
				typeof data.dropOffLocation === "string" &&
				data.dropOffLocation
			) {
				data.dropOffLocation = JSON.parse(data.dropOffLocation);
			}

			data = Object.fromEntries(
				Object.entries(data).filter(([key]) => {
					return (
						!key.startsWith("pickupLocation.") &&
						!key.startsWith("dropOffLocation.")
					);
				})
			);

			const instance = plainToInstance(CarHireJob, data);
			const errors = validateSync(instance, {
				whitelist: true,
				forbidNonWhitelisted: true,
			});

			console.log(errors);

			if (errors.length > 0) throw formatValidationErrors(errors);

			Object.assign(this, instance);
		}
	}

	toObject() {
		return {
			typeId: this.typeId,
			vehicleType: this.vehicleType,
			clientName: this.clientName,
			passenger: this.passenger,
			pickupLocation: this.pickupLocation,
			carServiceType: this.carServiceType,
			date: this.date,
			status: this.status,
		};
	}
}

export function formatValidationErrors(errors: ValidationError[]): JobError {
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
