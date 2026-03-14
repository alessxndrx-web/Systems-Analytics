export interface PlaceCandidate {
  externalId: string;
  name: string;
  category: string;
  niche: string;
  city: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  reviewCount?: number;
  website?: string;
  phone?: string;
}

export interface PlacesProvider {
  search(city: string, country: string, niche: string): Promise<PlaceCandidate[]>;
}
