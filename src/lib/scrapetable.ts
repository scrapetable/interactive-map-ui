import { SCRAPETABLE_API_BASE } from "@/lib/constants";
import type { MapsSearchResponse, SearchParams } from "@/lib/types";

export async function searchMaps(
  params: SearchParams,
  apiKey: string,
): Promise<MapsSearchResponse> {
  const url = new URL(`${SCRAPETABLE_API_BASE}/v1/maps`);
  url.searchParams.set("query", params.query);
  url.searchParams.set("lat", String(params.lat));
  url.searchParams.set("lng", String(params.lng));
  url.searchParams.set("zoom", String(params.zoom));
  url.searchParams.set("limit", String(params.limit));
  url.searchParams.set("lang", params.lang);
  url.searchParams.set("country", params.country);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = (await response.json()) as MapsSearchResponse & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? data.message ?? `ScrapeTable error (${response.status})`);
  }

  return data;
}
