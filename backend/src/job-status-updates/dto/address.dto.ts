import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Address {
  toObject(): { address: string; longitude: number; latitude: number } {
    return {
      address: this.address,
      longitude: this.longitude,
      latitude: this.latitude,
    };
  }

  @IsString()
  @IsNotEmpty({ message: 'address is required' })
  address: string;

  @IsNumber()
  @IsNotEmpty({ message: 'longitude is required' })
  longitude: number;

  @IsNumber()
  @IsNotEmpty({ message: 'latitude is required' })
  latitude: number;
}
