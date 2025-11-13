import { IsNotEmpty, IsString } from 'class-validator';

export class PlaceDetailsQueryDTO {
  @IsString()
  @IsNotEmpty({ message: 'Place ID (placeId) is required' })
  placeId: string;
}
