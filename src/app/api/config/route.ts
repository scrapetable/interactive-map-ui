import { NextResponse } from "next/server";
import { getEnvApiKey } from "@/lib/api-key";

export async function GET() {
  return NextResponse.json({ hasEnvKey: Boolean(getEnvApiKey()) });
}
