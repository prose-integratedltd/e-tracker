import { IsNotEmpty, IsString } from 'class-validator';

export class AutocompletePlaceQueryDTO {
  @IsString()
  @IsNotEmpty({ message: 'Query (query) is required' })
  query: string;
}
