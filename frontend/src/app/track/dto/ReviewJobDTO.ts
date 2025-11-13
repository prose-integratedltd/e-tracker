import "reflect-metadata";
import {
	Min,
	Max,
	IsNumber,
	IsString,
	IsNotEmpty,
	IsOptional,
	validateSync,
	ValidationError,
} from "class-validator";
import { plainToInstance, Type } from "class-transformer";

export default class ReviewJobDTO {
	@IsString()
	@IsNotEmpty({ message: "Can not create review without a valid job ID" })
	jobId?: string;

	@IsNumber()
	@Type(() => Number)
	@Min(1, { message: "Rating must not be less than 1" })
	@Max(5, { message: "Rating must not be greater than 5" })
	rating?: number;

	@IsString()
	@IsOptional()
	comment?: string;

	constructor(data?: Partial<ReviewJobDTO>) {
		if (!data) return;

		data = Object.fromEntries(
			Object.entries(data).filter(([key]) => {
				return !key.includes("ACTION");
			})
		);

		const instance = plainToInstance(ReviewJobDTO, data);
		const errors = validateSync(instance, {
			whitelist: true,
			forbidNonWhitelisted: true,
		});

		if (errors.length > 0) throw formatValidationErrors(errors);

		Object.assign(this, instance);
	}
}

export interface ReviewJobError {
	jobId?: string;
	rating?: string;
	comment?: string;
}

function formatValidationErrors(errors: ValidationError[]): ReviewJobError {
	let formatted: ReviewJobError = {};

	for (const error of errors) {
		if (error.constraints) {
			formatted = {
				...formatted,
				[error.property]: Object.values(error.constraints)[0],
			};
		}

		if (error.children && error.children.length > 0) {
			const childErrors = formatValidationErrors(error.children);
			for (const [childKey, message] of Object.entries(childErrors)) {
				formatted = {
					...formatted,
					[`${error.property}.${childKey}`]: message,
				};
			}
		}
	}

	return formatted;
}
