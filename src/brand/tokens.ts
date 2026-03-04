import {readFile} from 'node:fs/promises';
import path from 'node:path';
import type {BrandRuntime} from './types';

type BrandColorTokens = {
  primary: string;
  secondary: string;
  citizen: string;
  neutral: string;
  background: string;
};

function normalizeHex(value: unknown) {
  return typeof value === 'string' ? value : '';
}

async function loadBrandTokensFromPath(tokensPath: string): Promise<BrandColorTokens> {
  const filePath = path.join(process.cwd(), tokensPath, 'colors.json');
  const raw = await readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw) as {
    brand?: {
      primary?: string;
      secondary?: string;
      citizen?: string;
      neutral?: string;
      background?: string;
    };
  };

  const primary = normalizeHex(parsed?.brand?.primary);
  const secondary = normalizeHex(parsed?.brand?.secondary);
  const citizen = normalizeHex(parsed?.brand?.citizen);
  const neutral = normalizeHex(parsed?.brand?.neutral);
  const background = normalizeHex(parsed?.brand?.background);

  if (!primary || !secondary || !citizen || !neutral || !background) {
    throw new Error(`Invalid tokens for path: ${tokensPath}`);
  }

  return {primary, secondary, citizen, neutral, background};
}

function toBrandCssVariables(tokens: BrandColorTokens) {
  return [
    ':root {',
    `  --brand-primary: ${tokens.primary};`,
    `  --brand-secondary: ${tokens.secondary};`,
    `  --brand-citizen: ${tokens.citizen};`,
    `  --brand-neutral: ${tokens.neutral};`,
    `  --brand-background: ${tokens.background};`,
    '}'
  ].join('\n');
}

export async function loadBrandCssVars(brand: BrandRuntime) {
  const tokens = await loadBrandTokensFromPath(brand.tokens_path);
  return {
    cssVars: toBrandCssVariables(tokens),
    tokens
  };
}
