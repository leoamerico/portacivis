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

function loadBrandTokensFromRuntime(brand: BrandRuntime): BrandColorTokens {
  const primary = normalizeHex(brand?.tokens?.primary);
  const secondary = normalizeHex(brand?.tokens?.secondary);
  const citizen = normalizeHex(brand?.tokens?.citizen);
  const neutral = normalizeHex(brand?.tokens?.neutral);
  const background = normalizeHex(brand?.tokens?.background);

  if (!primary || !secondary || !citizen || !neutral || !background) {
    throw new Error(`Invalid tokens for brand: ${brand.brand_id}`);
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
  const tokens = loadBrandTokensFromRuntime(brand);
  return {
    cssVars: toBrandCssVariables(tokens),
    tokens
  };
}
