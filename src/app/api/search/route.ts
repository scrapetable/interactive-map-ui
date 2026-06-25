import { NextRequest, NextResponse } from "next/server";
import { resolveApiKey } from "@/lib/api-key";
import {
  DEFAULT_CENTER,
  DEFAULT_SEARCH_SETTINGS,
  DEFAULT_ZOOM,
} from "@/lib/constants";
import { searchMaps } from "@/lib/scrapetable";
import { saveSearch } from "@/lib/storage";
import type { SearchParams, SearchRequestBody } from "@/lib/types";

export async function POST(request: NextRequest) {
  let body: SearchRequestBody;

  try {
    body = (await request.json()) as SearchRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query = body.query?.trim();
  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const apiKey = resolveApiKey(request, body.apiKey);
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "API key required. Set SCRAPETABLE_API_KEY or provide key in Settings.",
      },
      { status: 401 },
    );
  }

  const limit = Math.min(
    500,
    Math.max(1, Number(body.limit ?? DEFAULT_SEARCH_SETTINGS.limit)),
  );

  const params: SearchParams = {
    query,
    lat: Number(body.lat ?? DEFAULT_CENTER.lat),
    lng: Number(body.lng ?? DEFAULT_CENTER.lng),
    zoom: Number(body.zoom ?? DEFAULT_ZOOM),
    limit,
    lang: body.lang ?? DEFAULT_SEARCH_SETTINGS.lang,
    country: body.country ?? DEFAULT_SEARCH_SETTINGS.country,
  };

  try {
    const response = await searchMaps(params, apiKey);

    let searchId: string | undefined;
    try {
      const record = await saveSearch(params, response);
      searchId = record.id;
    } catch (storageError) {
      console.error("Failed to save search locally:", storageError);
    }

    return NextResponse.json({ ...response, searchId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "ScrapeTable request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
