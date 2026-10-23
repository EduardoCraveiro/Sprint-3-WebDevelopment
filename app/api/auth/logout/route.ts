import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "../../../lib/auth";
import { isSameOrigin } from "../../../lib/request-origin";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origem não permitida." }, { status: 403 });
  }
  const response = NextResponse.json({ message: "Sessão encerrada." });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
