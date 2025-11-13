import { AutocompletePlaceQueryDTO } from './dto/autocomplete-place-query.dto';
import { PlaceDetailsQueryDTO } from './dto/place-details-query.dto';
import { ReverseGeocodeDTO } from './dto/reverse-geocode.dto';
import { GooglePlacesService } from './google-places.service';
import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';

@Controller('google-places')
export class GooglePlacesController {
  constructor(private readonly googlePlacesService: GooglePlacesService) {}

  @Get('/search/:query')
  findAll(@Param() { query }: AutocompletePlaceQueryDTO) {
    return this.googlePlacesService.searchPlaces(query);
  }

  @Get('/details/:placeId')
  getPlaceDetails(@Param() { placeId }: PlaceDetailsQueryDTO) {
    return this.googlePlacesService.getPlaceDetails(placeId);
  }

  @HttpCode(200)
  @Post('/reverse-geocode')
  reverseGeocode(@Body() reverseGeocodeDTO: ReverseGeocodeDTO) {
    return this.googlePlacesService.reverseGeocode(reverseGeocodeDTO);
  }
}
