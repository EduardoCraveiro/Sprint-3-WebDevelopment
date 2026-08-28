import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renderiza a aplicacao NEXO", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>NEXO \| Central de conteudo<\/title>/i);
  assert.match(html, /Visao geral/);
  assert.match(html, /Adicionar item/);
  assert.match(html, /Minha biblioteca/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("inclui os requisitos funcionais no codigo", async () => {
  const [app, readme, integrantes] = await Promise.all([
    readFile(new URL("app/components/NexoApp.tsx", root), "utf8"),
    readFile(new URL("README.md", root), "utf8"),
    readFile(new URL("INTEGRANTES.TXT", root), "utf8"),
  ]);
  assert.match(app, /localStorage\.setItem/);
  assert.match(app, /Math\.random/);
  assert.match(app, /Math\.round/);
  assert.match(app, /Math\.max/);
  assert.match(readme, /Como instalar as dependencias/);
  assert.match(readme, /Uso de inteligencia artificial/);
  assert.match(integrantes, /Eduardo Craveiro/);
});
