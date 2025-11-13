import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class Address {
	@IsString()
	@IsNotEmpty({ message: "Address is required" })
	address?: string;

	@IsNumber()
	@IsNotEmpty({ message: "Longitude is required" })
	longitude?: number;

	@IsNumber()
	@IsNotEmpty({ message: "Latitude is required" })
	latitude?: number;
}
