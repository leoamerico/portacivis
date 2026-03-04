import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const requireCjs = createRequire(import.meta.url);

const requiredHeaders = [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
];

async function main() {
  const nextConfig = requireCjs(path.join(repoRoot, 'next.config.js'));

  if (typeof nextConfig?.headers !== 'function') {
    throw new Error('next.config.js: headers() is required');
  }

  const rules = await nextConfig.headers();
  const headers = (rules || []).flatMap((rule) => rule.headers || []);
  const keys = new Set(headers.map((item) => item.key));

  const missing = requiredHeaders.filter((key) => !keys.has(key));
  if (missing.length > 0) {
    throw new Error(`Missing required security headers: ${missing.join(', ')}`);
  }

  const csp = headers.find((item) => item.key === 'Content-Security-Policy')?.value || '';
  if (!csp.includes("default-src 'self'")) {
    throw new Error("CSP must include default-src 'self'");
  }

  console.log('Security headers check: OK');
}

main().catch((error) => {
  console.error(`Security headers check failed: ${error.message}`);
  process.exit(1);
});
