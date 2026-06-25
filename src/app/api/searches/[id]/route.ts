import { NextResponse } from "next/server";
import { loadSearch } from "@/lib/storage";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const record = await loadSearch(id);

  if (!record) {
    return NextResponse.json({ error: "Search not found" }, { status: 404 });
  }

  return NextResponse.json(record);
}
