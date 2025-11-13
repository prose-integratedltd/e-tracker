import "reflect-metadata";
import { plainToInstance, Type } from "class-transformer";
import {
	IsMilitaryTime,
	ValidateNested,
	IsDateString,
	validateSync,
	IsNotEmpty,
	IsOptional,
	IsBoolean,
	IsObject,
	IsString,
} from "class-validator";
import { formatValidationErrors } from "./car.hire.job.dto";
import { Address } from "./address";

export class TransportationStatusUpdateDto {
	@IsString()
	@IsNotEmpty({ message: "Job ID is required" })
	jobId?: string;

	@IsString()
	@IsNotEmpty({ message: "Title is required" })
	title?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsBoolean()
	@IsOptional()
	completed: boolean = false;

	@IsObject()
	@IsNotEmpty({ message: "Location is required" })
	@ValidateNested()
	@Type(() => Address)
	location?: Address;

	@IsOptional()
	@IsMilitaryTime()
	@IsNotEmpty({ message: "Time is required" })
	time?: string;

	@IsDateString()
	@IsNotEmpty({ message: "Date is required" })
	date?: string;

	constructor(data?: Partial<TransportationStatusUpdateDto>) {
		if (data) {
			if (data.completed) data.completed = true;

			if (typeof data.location === "string" && data.location) {
				data.location = JSON.parse(data.location);
			}

			data = Object.fromEntries(
				Object.entries(data).filter(([key]) => {
					return !key.startsWith("location.");
				})
			);

			const instance = plainToInstance(
				TransportationStatusUpdateDto,
				data
			);
			const errors = validateSync(instance, {
				whitelist: true,
				forbidNonWhitelisted: true,
			});

			if (errors.length > 0) throw formatValidationErrors(errors);

			Object.assign(this, instance);
		}
	}
}
