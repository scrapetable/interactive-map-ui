export interface MapsBusiness {
  businessId?: string;
  name?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  website?: string;
  placeId?: string;
  placeLink?: string;
  types?: string;
  tags?: string[];
  description?: string;
  priceLevel?: number;
  verified?: boolean;
  timezone?: string;
  workingHours?: Record<string, string>;
  isPermanentlyClosed?: boolean;
  isTemporarilyClosed?: boolean;
  websiteTitle?: string | null;
  websiteDescription?: string | null;
  emails?: Array<{ value: string; sources: string[] }>;
  phoneNumbers?: Array<{ value: string; sources: string[] }>;
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  snapchat?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  github?: string | null;
  youtube?: string | null;
  pinterest?: string | null;
}

export interface MapsSearchResponse {
  success: boolean;
  workspaceId?: string;
  query?: string;
  businessCount?: number;
  creditsRemaining?: number;
  data?: MapsBusiness[];
  error?: string;
}

export interface SearchParams {
  query: string;
  lat: number;
  lng: number;
  zoom: number;
  limit: number;
  lang: string;
  country: string;
}

export interface HistoryEntry {
  id: string;
  query: string;
  businessCount: number;
  lat: number;
  lng: number;
  zoom: number;
  limit: number;
  lang: string;
  country: string;
  createdAt: string;
  label?: string;
  tags?: string[];
  deletedAt?: string | null;
  fileMissing?: boolean;
}

export interface HistoryFile {
  version: 1;
  updatedAt: string;
  entries: HistoryEntry[];
}

export interface SearchRecord {
  version: 1;
  id: string;
  createdAt: string;
  params: SearchParams;
  response: MapsSearchResponse;
}

export interface SearchSettings {
  limit: number;
  lang: string;
  country: string;
  useMapZoom: boolean;
  overrideZoom: number;
}

export interface SearchRequestBody extends Partial<SearchParams> {
  apiKey?: string;
}

export interface SearchResponse extends MapsSearchResponse {
  searchId?: string;
}
