import { randomBytes } from "node:crypto";
import { writeFileSync, existsSync } from "node:fs";

// Cria apenas uma chave local. Nunca substitui uma configuração existente.
if (!existsSync(".env.local")) {
  writeFileSync(".env.local", `SESSION_SECRET=${randomBytes(32).toString("hex")}\n`, { flag: "wx", mode: 0o600 });
  console.log("Configuração local criada. .env.local não deve ser versionado ou incluído no ZIP.");
}
