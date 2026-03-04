import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from 'yaml';

const repoRoot = process.cwd();
const src = path.join(repoRoot, 'governance', 'catalog', 'BRANDS.yml');
const out = path.join(repoRoot, 'src', 'brand', 'registry.generated.ts');

const yml = fs.readFileSync(src, 'utf8');
const parsed = YAML.parse(yml);

if (!parsed?.brands?.length) {
  throw new Error('BRANDS.yml inválido: brands[] ausente');
}

const requiredFields = ['brand_id', 'name', 'category', 'assets_path', 'tokens_path', 'docs_path', 'governance'];
const seen = new Set();

for (const brand of parsed.brands) {
  for (const field of requiredFields) {
    if (!(field in brand)) {
      throw new Error(`BRANDS.yml inválido: campo obrigatório ausente (${field})`);
    }
  }

  const brandId = String(brand.brand_id ?? '').toUpperCase();
  if (!brandId || brandId !== String(brand.brand_id ?? '')) {
    throw new Error(`BRANDS.yml inválido: brand_id deve estar em uppercase (${brand.brand_id})`);
  }

  if (seen.has(brandId)) {
    throw new Error(`BRANDS.yml inválido: brand_id duplicado (${brandId})`);
  }

  seen.add(brandId);
}

const sourceHash = crypto.createHash('sha256').update(yml).digest('hex');

const brands = parsed.brands.map((b) => ({
  brand_id: String(b.brand_id).toUpperCase(),
  name: String(b.name),
  category: String(b.category),
  slogan: String(b.slogan ?? ''),
  owner: String(b.owner ?? 'ENVNEO'),
  assets_path: String(b.assets_path),
  tokens_path: String(b.tokens_path),
  docs_path: String(b.docs_path),
  governance: {
    adr: String(b.governance?.adr ?? ''),
    compliance_case: String(b.governance?.compliance_case ?? '')
  }
}));

const brandIds = brands.map((b) => `"${b.brand_id}"`).join(' | ');

const content = `/* AUTO-GENERATED FILE — DO NOT EDIT\n * Source: governance/catalog/BRANDS.yml\n * Source-Hash: ${sourceHash}\n */\nexport type BrandId = ${brandIds};\n\nexport const BRANDS = ${JSON.stringify(brands, null, 2)} as const;\n\nexport const BRAND_INDEX = new Map(BRANDS.map((b) => [b.brand_id, b]));\n`;

fs.mkdirSync(path.dirname(out), {recursive: true});
fs.writeFileSync(out, content, 'utf8');

console.log(`OK: generated ${path.relative(repoRoot, out)} from ${path.relative(repoRoot, src)}`);
