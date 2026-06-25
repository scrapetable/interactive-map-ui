import { NextResponse } from "next/server";
import { listHistory } from "@/lib/storage";

export async function GET() {
  try {
    const searches = await listHistory();
    return NextResponse.json({ searches });
  } catch (error) {
    console.error("Failed to list searches:", error);
    return NextResponse.json({ searches: [] });
  }
}
