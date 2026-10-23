import { NextResponse } from "next/server";
import { INITIAL_HISTORY, INITIAL_ITEMS } from "../../data";
import { getSession } from "../../lib/auth";

export async function GET() {
  if (!await getSession()) {
    return NextResponse.json({ message: "Entre para acessar suas memórias." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ items: INITIAL_ITEMS, history: INITIAL_HISTORY, source: "mock-humanly" }, { headers: { "Cache-Control": "no-store" } });
}
