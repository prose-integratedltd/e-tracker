import { PartialType } from '@nestjs/mapped-types';
import { CreateGooglePlaceDto } from './create-google-place.dto';

export class UpdateGooglePlaceDto extends PartialType(CreateGooglePlaceDto) {}
