import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlaceCandidate, PlacesProvider } from './places.interface';

type GooglePlace = {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  primaryTypeDisplayName?: { text?: string };
};

@Injectable()
export class GooglePlacesProvider implements PlacesProvider {
  private readonly logger = new Logger(GooglePlacesProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async search(city: string, country: string, niche: string): Promise<PlaceCandidate[]> {
    const apiKey = this.configService.get<string>('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      return [];
    }

    const url = 'https://places.googleapis.com/v1/places:searchText';
    const body = {
      textQuery: `${niche} in ${city}, ${country}`,
      maxResultCount: 20,
      languageCode: 'en'
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask':
            'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber,places.primaryTypeDisplayName'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(`Google Places request failed (${response.status}): ${errorBody}`);
        return [];
      }

      const json = (await response.json()) as { places?: GooglePlace[] };
      const places = json.places ?? [];

      return places
        .filter((place) => place.id && place.displayName?.text && place.location?.latitude && place.location?.longitude)
        .map((place) => ({
          externalId: place.id,
          name: place.displayName?.text ?? 'Unknown business',
          category: place.primaryTypeDisplayName?.text ?? niche,
          niche,
          city,
          country,
          address: place.formattedAddress ?? `${city}, ${country}`,
          latitude: place.location?.latitude ?? 0,
          longitude: place.location?.longitude ?? 0,
          rating: place.rating,
          reviewCount: place.userRatingCount,
          website: place.websiteUri,
          phone: place.nationalPhoneNumber
        }));
    } catch (error) {
      this.logger.error('Google Places request threw an error', error instanceof Error ? error.stack : undefined);
      return [];
    }
  }
}
