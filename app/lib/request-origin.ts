// Next.js pode normalizar request.url para localhost atrás do servidor de desenvolvimento.
// Compare o Origin com o Host público recebido, preservando a proteção contra CSRF.
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const url = new URL(origin);
    const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ?? new URL(request.url).protocol.replace(":", "");
    return url.host === request.headers.get("host") && url.protocol === `${protocol}:`;
  } catch { return false; }
}
