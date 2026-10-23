import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes, createHmac } from "node:crypto";
import { once } from "node:events";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { after, before, test } from "node:test";

let server;
let base;
let logs = "";
const secret = randomBytes(32).toString("hex");

before(async () => {
  const portProbe = createServer();
  portProbe.listen(0, "127.0.0.1");
  await once(portProbe, "listening");
  const { port } = portProbe.address();
  await new Promise((resolve) => portProbe.close(resolve));
  base = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    env: { ...process.env, SESSION_SECRET: secret }, stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
  });
  server.stdout.on("data", (chunk) => { logs += chunk; });
  server.stderr.on("data", (chunk) => { logs += chunk; });
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(base)).ok) return; } catch { /* Aguardando o servidor. */ }
    if (server.exitCode !== null) throw new Error(logs);
    await delay(250);
  }
  throw new Error(`Servidor não iniciou: ${logs}`);
});

after(async () => {
  if (server && server.exitCode === null) {
    const stopped = once(server, "exit");
    server.kill();
    await stopped;
  }
});

async function login(password = "Humanly@2026", extra = {}) {
  return fetch(`${base}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json", ...extra }, body: JSON.stringify({ email: "professor@humanly.com", password }) });
}

test("apresentação e login são públicos; imagens e CSS estão disponíveis", async () => {
  const response = await fetch(base);
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /Grandes memórias/);
  assert.match(html, /href="\/login"/);
  assert.doesNotMatch(html, /Anotacoes no quadro/);
  assert.match(await (await fetch(`${base}/login`)).text(), /Acesso de demonstração/);
  assert.equal((await fetch(`${base}/jovi/mode-campus.webp`)).status, 200);
  const cssPath = html.match(/href="([^" ]+\.css[^" ]*)"/)?.[1];
  assert.ok(cssPath, "A página deve carregar o CSS compilado");
  const css = await (await fetch(new URL(cssPath, base))).text();
  assert.ok(css.includes("--tw-"), "O CSS deve conter as variáveis compiladas do Tailwind");
  assert.ok(css.includes(".md\\:grid-cols-2"), "O CSS deve conter o layout responsivo do Tailwind");
});

test("todas as rotas privadas e a API exigem sessão válida", async () => {
  for (const path of ["/biblioteca", "/biblioteca/itens", "/biblioteca/colecoes", "/biblioteca/favoritos", "/biblioteca/historico", "/biblioteca/lixeira"]) {
    const response = await fetch(`${base}${path}`, { redirect: "manual" });
    assert.equal(response.status, 307, path);
    assert.equal(response.headers.get("location"), "/login");
    assert.doesNotMatch(await response.text(), /Anotacoes no quadro/);
  }
  const denied = await fetch(`${base}/api/memorias`);
  assert.equal(denied.status, 401);
  assert.doesNotMatch(await denied.text(), /Anotacoes no quadro/);
});

test("credenciais incorretas, JSON inválido e origem externa são rejeitados", async () => {
  assert.equal((await login("incorreta")).status, 401);
  const malformed = await fetch(`${base}/api/auth/login`, { method: "POST", body: "{" });
  assert.equal(malformed.status, 400);
  assert.equal((await login("Humanly@2026", { Origin: "https://outro-site.example" })).status, 403);
  const logout = await fetch(`${base}/api/auth/logout`, { method: "POST", headers: { Origin: "https://outro-site.example" } });
  assert.equal(logout.status, 403);
});

test("login emite cookie protegido, libera as páginas e entrega memórias pela API", async () => {
  const response = await login("Humanly@2026", { Origin: base });
  assert.equal(response.status, 200);
  const cookie = response.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /SameSite=lax/i);
  assert.match(cookie, /Secure/i);
  const headers = { Cookie: cookie.split(";")[0] };
  const dataResponse = await fetch(`${base}/api/memorias`, { headers });
  assert.equal(dataResponse.status, 200);
  assert.equal(dataResponse.headers.get("cache-control"), "no-store");
  const data = await dataResponse.json();
  assert.equal(data.items.length, 6);
  assert.equal(data.items.find((item) => item.id === 102).privacy, "Privado");
  assert.ok(data.history.length > 0);
  for (const path of ["/biblioteca", "/biblioteca/itens", "/biblioteca/colecoes", "/biblioteca/favoritos", "/biblioteca/historico", "/biblioteca/lixeira"]) {
    assert.equal((await fetch(`${base}${path}`, { headers })).status, 200, path);
  }
  const unknown = await fetch(`${base}/biblioteca/inexistente`, { headers });
  assert.equal(unknown.status, 404);
  const loginPage = await fetch(`${base}/login`, { headers, redirect: "manual" });
  assert.equal(loginPage.headers.get("location"), "/biblioteca");
  const logout = await fetch(`${base}/api/auth/logout`, { method: "POST", headers });
  assert.match(logout.headers.get("set-cookie"), /Max-Age=0/i);
  assert.equal((await fetch(`${base}/api/memorias`)).status, 401);
});

test("sessões adulteradas e expiradas não autorizam o acesso", async () => {
  const payload = Buffer.from(JSON.stringify({ email: "professor@humanly.com", expires: Date.now() - 1000 })).toString("base64url");
  const expired = `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
  for (const token of ["qualquer-coisa", `${payload}.invalido`, expired]) {
    assert.equal((await fetch(`${base}/api/memorias`, { headers: { Cookie: `jovi-session=${token}` } })).status, 401);
  }
});
