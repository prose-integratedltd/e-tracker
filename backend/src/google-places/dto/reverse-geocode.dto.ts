import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ReverseGeocodeDTO {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty({ message: 'Latitude (latitude) is required' })
  latitude: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty({ message: 'Longitude (longitude) is required' })
  longitude: number;
}
