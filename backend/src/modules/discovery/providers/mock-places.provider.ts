import { Injectable } from '@nestjs/common';
import { PlaceCandidate, PlacesProvider } from './places.interface';

@Injectable()
export class MockPlacesProvider implements PlacesProvider {
  async search(city: string, country: string, niche: string): Promise<PlaceCandidate[]> {
    return [
      {
        externalId: `${city}-${niche}-1`,
        name: `${niche} Central ${city}`,
        category: niche,
        niche,
        city,
        country,
        address: `Main Ave 123, ${city}`,
        latitude: 9.93,
        longitude: -84.08,
        rating: 4.1,
        reviewCount: 22,
        website: undefined,
        phone: '+50688889999'
      },
      {
        externalId: `${city}-${niche}-2`,
        name: `${niche} Prime ${city}`,
        category: niche,
        niche,
        city,
        country,
        address: `North St 45, ${city}`,
        latitude: 9.94,
        longitude: -84.09,
        rating: 4.7,
        reviewCount: 180,
        website: 'https://example.com',
        phone: '+50687776666'
      }
    ];
  }
}
