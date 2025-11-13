import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import {
	IsMilitaryTime,
	IsDateString,
	validateSync,
	IsNotEmpty,
	IsOptional,
	IsBoolean,
	IsString,
} from "class-validator";
import { formatValidationErrors } from "./car.hire.job.dto";

export class StatusUpdateDto {
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

	@IsOptional()
	@IsMilitaryTime()
	@IsNotEmpty({ message: "Time is required" })
	time?: string;

	@IsDateString()
	@IsNotEmpty({ message: "Date is required" })
	date?: string;

	constructor(data?: Partial<StatusUpdateDto>) {
		if (data) {
			if (data.completed) data.completed = true;

			console.log(data);
			
			const instance = plainToInstance(StatusUpdateDto, data);
			const errors = validateSync(instance, {
				whitelist: true,
				forbidNonWhitelisted: true,
			});

			if (errors.length > 0) throw formatValidationErrors(errors);

			Object.assign(this, instance);
		}
	}
}
