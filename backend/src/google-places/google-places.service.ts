import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ReverseGeocodeDTO } from './dto/reverse-geocode.dto';

@Injectable()
export class GooglePlacesService {
  private readonly logger = new Logger(GooglePlacesService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://places.googleapis.com/v1/places';

  constructor(private readonly httpService: HttpService) {
    this.apiKey = process.env.GOOGLE_MAP_API_KEY;
  }

  async searchPlaces(input: string): Promise<any> {
    const url = `${this.baseUrl}:autocomplete`;
    const body = { input: input };

    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-api-key': this.apiKey,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers }).pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
      );

      return (response.data['suggestions'] ?? []).map((suggestion) => {
        const placePrediction = suggestion['placePrediction'];

        return {
          placeId: placePrediction['placeId'],
          address: placePrediction['text']['text'],
        };
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error('Error from Google Places API:', error.response.data);
        throw new ForbiddenException(error.response.data);
      } else {
        this.logger.error('Unexpected error:', error);
      }

      throw new Error(`Google Places API error: ${error.message}`);
    }
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    const url = `${this.baseUrl}/${placeId}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-api-key': this.apiKey,
      'X-Goog-FieldMask':
        'displayName,location.latitude,location.longitude,nationalPhoneNumber',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers }).pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
      );

      return {
        address: response.data['displayName']['text'],
        latitude: response.data['location']['latitude'],
        longitude: response.data['location']['longitude'],
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error('Error from Google Places API:', error.response.data);
        throw new ForbiddenException(error.response.data);
      } else {
        this.logger.error('Unexpected error:', error);
      }

      throw new Error(`Google Places API error: ${error.message}`);
    }
  }

  async reverseGeocode({
    latitude,
    longitude,
  }: ReverseGeocodeDTO): Promise<any> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json`;
    const params = {
      key: this.apiKey,
      latlng: `${latitude},${longitude}`,
    };
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-api-key': this.apiKey,
      'X-Goog-FieldMask':
        'displayName,location.latitude,location.longitude,nationalPhoneNumber',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { params, headers }).pipe(
          catchError((error: AxiosError) => {
            console.log(error);

            throw error;
          }),
        ),
      );

      console.log(response.data['results'].length);

      if (response.data['results'].length == 0) {
        throw new NotFoundException('Not result found');
      }

      const results = response.data['results'][0];

      return {
        placeId: results['place_id'],
        address: results['formatted_address'],
        latitude: latitude,
        longitude: longitude,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          'Error from Google Geocode API:',
          error.response.data,
        );
        throw new ForbiddenException(error.response.data);
      } else {
        throw error;
      }
    }
  }
}
