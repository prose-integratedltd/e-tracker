import { plainToInstance } from "class-transformer";
import JobStatus from "@/app/data/job.status";
import {
	IsEnum,
	IsUUID,
	IsString,
	IsNotEmpty,
	IsDateString,
	validateSync,
	ValidationError,
	IsOptional,
} from "class-validator";
import { JobError } from "./job.error";

export class CustomClearanceJob {
	@IsUUID()
	@IsNotEmpty({ message: "Job type is required" })
	typeId?: string;

	@IsString()
	@IsNotEmpty({ message: "Title is required" })
	name?: string;

	@IsString()
	@IsNotEmpty({ message: "Client/Company name is required" })
	clientName?: string;

	@IsDateString()
	@IsNotEmpty({ message: "Date is required" })
	date?: string;

	@IsString()
	@IsNotEmpty({ message: "Shipment type (shipmentType) is required" })
	shipmentType?: string;

	@IsString()
	@IsNotEmpty({ message: "Goods type is required" })
	goodsType?: string;

	@IsString()
	@IsNotEmpty({ message: "Clearing type is required" })
	clearingType?: string;

	@IsString()
	@IsNotEmpty({
		message: "State available documentations is required",
	})
	stateAvailableDocumentations?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsEnum(JobStatus)
	status: JobStatus = JobStatus.Open;

	constructor(data?: Partial<CustomClearanceJob>) {
		if (data) {
			const instance = plainToInstance(CustomClearanceJob, data);
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
			clientName: this.clientName,
			date: this.date,
			shipmentType: this.shipmentType,
			goodsType: this.goodsType,
			clearingType: this.clearingType,
			stateAvailableDocumentations: this.stateAvailableDocumentations,
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
