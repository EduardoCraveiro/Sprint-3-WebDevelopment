import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("estrutura a aplicacao NEXO em componentes React", async () => {
  const [page, layout, app, header, sidebar] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/components/NexoApp.tsx", root), "utf8"),
    readFile(new URL("app/components/Header.tsx", root), "utf8"),
    readFile(new URL("app/components/Sidebar.tsx", root), "utf8"),
  ]);
  assert.match(page, /<NexoApp/);
  assert.match(layout, /NEXO \| Central de conteudo/);
  assert.match(app, /<Header/);
  assert.match(app, /<Sidebar/);
  assert.match(header, /Adicionar item/);
  assert.match(sidebar, /Minha biblioteca/);
});

test("inclui os requisitos funcionais e a equipe Humanly", async () => {
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
  assert.match(readme, /EduardoCraveiro\/Sprint-3-WebDevelopment/);
  assert.match(integrantes, /EQUIPE HUMANLY/);
  assert.match(integrantes, /Eduardo Bechara Medeiros Craveiro - RM 571081/);
  assert.match(integrantes, /Gustavo Moita de Lima - RM 569180/);
  assert.match(integrantes, /Bruno Carrero dos Santos - RM 569423/);
});
