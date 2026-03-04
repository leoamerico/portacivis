import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from 'yaml';

const repoRoot = process.cwd();
const brandsCatalogPath = path.join(repoRoot, 'governance', 'catalog', 'BRANDS.yml');
const generatedRegistryPath = path.join(repoRoot, 'src', 'brand', 'registry.generated.ts');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function exists(relPath) {
  return fs.existsSync(path.join(repoRoot, relPath));
}

function readCatalog() {
  assert(fs.existsSync(brandsCatalogPath), 'Missing governance/catalog/BRANDS.yml');
  const raw = fs.readFileSync(brandsCatalogPath, 'utf8');
  const parsed = YAML.parse(raw);
  assert(Array.isArray(parsed?.brands) && parsed.brands.length > 0, 'BRANDS.yml inválido: brands[] ausente');
  return {raw, brands: parsed.brands};
}

function verifyGeneratedRegistry(sourceYaml) {
  assert(fs.existsSync(generatedRegistryPath), 'Missing src/brand/registry.generated.ts');
  const generated = fs.readFileSync(generatedRegistryPath, 'utf8');
  const expectedHash = crypto.createHash('sha256').update(sourceYaml).digest('hex');
  assert(generated.includes(`Source-Hash: ${expectedHash}`), 'registry.generated.ts desatualizado; execute npm run gen:brand-registry');
}

function verifyBrandPaths(brands) {
  const seen = new Set();

  for (const brand of brands) {
    const rawId = String(brand.brand_id ?? '');
    const id = rawId.toUpperCase();
    assert(id.length > 0, 'brand_id ausente em BRANDS.yml');
    assert(rawId === id, `brand_id deve estar em uppercase: ${rawId}`);
    assert(!seen.has(id), `brand_id duplicado em BRANDS.yml: ${id}`);
    seen.add(id);

    const assetsPath = String(brand.assets_path ?? '');
    const tokensPath = String(brand.tokens_path ?? '');
    const docsPath = String(brand.docs_path ?? '');

    assert(assetsPath.length > 0, `assets_path ausente para ${id}`);
    assert(tokensPath.length > 0, `tokens_path ausente para ${id}`);
    assert(docsPath.length > 0, `docs_path ausente para ${id}`);

    assert(exists(assetsPath), `assets_path inexistente para ${id}: ${assetsPath}`);
    assert(exists(tokensPath), `tokens_path inexistente para ${id}: ${tokensPath}`);
    assert(exists(docsPath), `docs_path inexistente para ${id}: ${docsPath}`);

    const governance = brand.governance ?? {};
    const complianceCase = String(governance.compliance_case ?? '');
    assert(complianceCase.length > 0, `compliance_case ausente para ${id}`);
    const compliancePath = `governance/compliance-cases/${complianceCase}`;
    assert(exists(compliancePath), `compliance case inexistente para ${id}: ${compliancePath}`);
  }
}

function verifyBrandPortaCivisSpecifics() {
  assert(exists('governance/catalog/BRAND-PORTACIVIS.yml'), 'Missing governance/catalog/BRAND-PORTACIVIS.yml');
  assert(exists('docs/brand/PORTACIVIS-BRAND-GUIDE.md'), 'Missing docs/brand/PORTACIVIS-BRAND-GUIDE.md');
  assert(exists('docs/architecture/decisions/ADR-PORTACIVIS-BRAND-GOVERNANCE.md'), 'Missing ADR-PORTACIVIS-BRAND-GOVERNANCE.md');
}

function main() {
  const {raw, brands} = readCatalog();
  verifyGeneratedRegistry(raw);
  verifyBrandPaths(brands);
  verifyBrandPortaCivisSpecifics();
  console.log('Brand governance verification: OK');
}

try {
  main();
} catch (error) {
  console.error(`Brand governance verification failed: ${error.message}`);
  process.exit(1);
}
