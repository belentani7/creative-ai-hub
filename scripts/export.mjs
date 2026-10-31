#!/usr/bin/env node
// Export independiente de los datos principales de creative-ai-hub (LUCID/LAB):
// el catálogo de herramientas de IA, los tipos de medio y las ideas iniciales.
//
// Uso:   npm run export   (o node scripts/export.mjs)
// Salida: dist/catalog.export.json  (dist/ está gitignoreado; es un artefacto)

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "client", "src", "data", "catalog.json");

const catalog = JSON.parse(await readFile(catalogPath, "utf-8"));

const payload = {
  app: "creative-ai-hub (LUCID/LAB)",
  description: "Escritorio de composición de prompts para herramientas de IA generativa (imagen, vídeo, voz y música).",
  exportedAt: new Date().toISOString(),
  source: "client/src/data/catalog.json",
  mediaTypes: catalog.mediaTypes.map((entry) => entry.label),
  starterIdeas: catalog.starterIdeas,
  defaultPrompt: catalog.defaultPrompt,
  toolCount: catalog.tools.length,
  tools: catalog.tools,
};

const outDir = path.join(root, "dist");
const outPath = path.join(outDir, "catalog.export.json");
await mkdir(outDir, { recursive: true });
await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");

console.log(`Export OK: ${payload.toolCount} herramientas, ${payload.mediaTypes.length} tipos de medio -> ${path.relative(root, outPath)}`);
