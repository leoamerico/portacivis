#!/usr/bin/env bun
/**
 * new-adr.ts — Gerador automático de ADRs para o PortaCivis
 *
 * Uso: bun run new-adr "Título da Decisão"
 *
 * O script:
 *  1. Determina o próximo número sequencial de ADR
 *  2. Gera o nome do arquivo em kebab-case
 *  3. Cria o arquivo a partir do ADR-TEMPLATE.md
 *  4. Imprime o caminho do arquivo criado
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const DECISIONS_DIR = join(import.meta.dir, "..", "docs", "architecture", "decisions");
const TEMPLATE_PATH = join(DECISIONS_DIR, "ADR-TEMPLATE.md");

function toKebabCase(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function getNextAdrNumber(): Promise<number> {
  const files = await readdir(DECISIONS_DIR);
  const numbers = files
    .map((f) => f.match(/^ADR-(\d+)-/))
    .filter(Boolean)
    .map((m) => parseInt(m![1], 10));

  return numbers.length === 0 ? 1 : Math.max(...numbers) + 1;
}

async function main() {
  const title = process.argv.slice(2).join(" ").trim();

  if (!title) {
    console.error('Usage: bun run new-adr "Título da Decisão"');
    process.exit(1);
  }

  const number = await getNextAdrNumber();
  const paddedNumber = String(number).padStart(3, "0");
  const kebab = toKebabCase(title);
  const filename = `ADR-${paddedNumber}-${kebab}.md`;
  const filePath = join(DECISIONS_DIR, filename);

  const today = new Date().toISOString().split("T")[0];
  const template = await readFile(TEMPLATE_PATH, "utf-8");

  const content = template
    .replace("ADR-XXX", `ADR-${paddedNumber}`)
    .replace("[Título Descritivo]", title)
    .replace("[Proposto | Aceito | Rejeitado | Substituído por ADR-YYY | Depreciado]", "Proposto");

  await writeFile(filePath, content, "utf-8");

  console.log(`✅ ADR criado: ${filePath}`);
  console.log(`\nPróximos passos:`);
  console.log(`  1. Edite o arquivo: ${filename}`);
  console.log(`  2. Adicione ao índice: docs/architecture/decisions/README.md`);
  console.log(`     | [ADR-${paddedNumber}](${filename}) | ${title} | Proposto | ${today} |`);
  console.log(`  3. Abra um PR para revisão`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
