import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const HEX_COLOR_PATTERN = /#[0-9a-fA-F]{6}\b/g;
const ALLOWLIST_MARKER = 'BRAND_COLOR_ALLOWLIST';
const ALLOWED_GENERATED_FILES = new Set([
  path.normalize('src/brand/registry.generated.ts')
]);

const scanRoots = [
  path.join(repoRoot, 'app'),
  path.join(repoRoot, 'src'),
  path.join(repoRoot, 'styles')
];

function collectFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const out = [];
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, {withFileTypes: true});

    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (/\.(ts|tsx|js|jsx|css|scss)$/.test(entry.name)) {
        out.push(full);
      }
    }
  }

  return out;
}

function main() {
  const files = scanRoots.flatMap(collectFiles);
  const violations = [];

  for (const file of files) {
    const rel = path.relative(repoRoot, file);
    if (ALLOWED_GENERATED_FILES.has(path.normalize(rel))) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf8');
    if (content.includes(ALLOWLIST_MARKER)) {
      continue;
    }

    const matches = content.match(HEX_COLOR_PATTERN);
    if (matches && matches.length > 0) {
      violations.push({
        file: rel,
        colors: [...new Set(matches)]
      });
    }
  }

  if (violations.length > 0) {
    console.error('Hardcoded brand colors found outside tokens/');
    for (const violation of violations) {
      console.error(`- ${violation.file}: ${violation.colors.join(', ')}`);
    }
    process.exit(1);
  }

  console.log('No hardcoded brand colors outside tokens/: OK');
}

try {
  main();
} catch (error) {
  console.error(`Color governance verification failed: ${error.message}`);
  process.exit(1);
}
