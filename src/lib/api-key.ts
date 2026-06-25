import { NextRequest } from "next/server";

export function getEnvApiKey(): string | null {
  const key = process.env.SCRAPETABLE_API_KEY?.trim();
  return key || null;
}

export function resolveApiKey(request: NextRequest, bodyApiKey?: string): string | null {
  const envKey = getEnvApiKey();
  if (envKey) return envKey;

  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const headerKey = authHeader.slice(7).trim();
    if (headerKey) return headerKey;
  }

  const key = bodyApiKey?.trim();
  return key || null;
}
