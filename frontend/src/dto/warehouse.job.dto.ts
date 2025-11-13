import { plainToInstance } from "class-transformer";
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
} from "class-validator";
import { JobError } from "./job.error";

export enum TransportMode {
	Land,
	Air,
	Sea,
}

export class WarehouseJob {
	@IsUUID()
	@IsNotEmpty({ message: "Job type is required" })
	typeId?: string;

	@IsString()
	@IsNotEmpty({ message: "Title is required" })
	name?: string;

	@IsString()
	@IsNotEmpty({ message: "Client name is required" })
	clientName?: string;

	@IsEnum(JobStatus)
	status: JobStatus = JobStatus.Open;

	@IsDateString()
	@IsOptional()
	date?: string;

	@IsString()
	@IsNotEmpty({ message: "Goods type is required" })
	goodsType?: string;

	@IsString()
	@IsNotEmpty({ message: "Warehouse size is required" })
	warehouseSize?: string;

	@IsString()
	@IsNotEmpty({
		message: "Scheduled operation date is required",
	})
	scheduledOperationDate?: string;

	@IsString()
	@IsNotEmpty({
		message: "Goods name is required",
	})
	goodsName?: string;

	@IsString()
	@IsNotEmpty({
		message: "Duration is required",
	})
	duration?: string;

	@IsString()
	@IsOptional()
	description?: string;

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

	constructor(data?: Partial<WarehouseJob>) {
		if (data) {
			const instance = plainToInstance(WarehouseJob, data);
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
