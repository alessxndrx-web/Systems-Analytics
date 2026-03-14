import { Injectable } from '@nestjs/common';
import { PlaceCandidate, PlacesProvider } from './places.interface';

@Injectable()
export class GooglePlacesProvider implements PlacesProvider {
  async search(city: string, country: string, niche: string): Promise<PlaceCandidate[]> {
    // Fallback-ready adapter point for Google Places API integration.
    // In MVP environment without keys, this provider intentionally returns an empty set.
    return Promise.resolve([]);
  }
}
