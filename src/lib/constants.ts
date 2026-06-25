export const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 };
export const DEFAULT_ZOOM = 13;

export const DEFAULT_SEARCH_SETTINGS = {
  limit: 20,
  lang: "English",
  country: "United States",
  useMapZoom: true,
  overrideZoom: 13,
};

export const LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
] as const;

export const COUNTRY_OPTIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
] as const;

export const SCRAPETABLE_API_BASE = "https://api.scrapetable.com";

export const STORAGE_KEYS = {
  apiKey: "scrapetable_api_key",
  searchSettings: "search-settings",
} as const;

export type SortOption =
  | ""
  | "rating-high"
  | "rating-low"
  | "reviews-high"
  | "reviews-low";
