import { NextRequest, NextResponse } from "next/server";
import { createSession, SESSION_COOKIE, SESSION_SECONDS, validCredentials } from "../../../lib/auth";
import { isSameOrigin } from "../../../lib/request-origin";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origem não permitida." }, { status: 403 });
  }
  let credentials;
  try { credentials = await request.json(); }
  catch { return NextResponse.json({ message: "Envie um JSON válido." }, { status: 400 }); }
  if (!credentials || !validCredentials(credentials.email, credentials.password)) {
    return NextResponse.json({ message: "E-mail ou senha incorretos." }, { status: 401 });
  }
  try {
    const response = NextResponse.json({ message: "Acesso autorizado." });
    response.cookies.set(SESSION_COOKIE, createSession(), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_SECONDS,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json({ message: "O acesso precisa da variável SESSION_SECRET no servidor. Consulte o README." }, { status: 503 });
  }
}
