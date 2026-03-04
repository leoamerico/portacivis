import {BRAND_INDEX} from './registry.generated';
import type {BrandRuntime} from './types';

function toPublicPath(assetPath: string) {
  return assetPath.replace(/^public\//, '/');
}

export function getBrandConfig(brandId: string): BrandRuntime {
  const id = brandId.toUpperCase();
  const hit = BRAND_INDEX.get(id as never);

  if (!hit) {
    throw new Error(`Brand not found: ${brandId}`);
  }

  const runtime = hit as unknown as {
    brand_id: string;
    name: string;
    category: string;
    slogan: string;
    owner: string;
    assets_path: string;
    tokens_path: string;
    docs_path: string;
    governance: {
      adr: string;
      compliance_case: string;
    };
    tokens: {
      primary: string;
      secondary: string;
      citizen: string;
      neutral: string;
      background: string;
    };
  };

  const baseAssets = toPublicPath(runtime.assets_path).replace(/\/$/, '');

  return {
    ...runtime,
    assets: {
      logo: `${baseAssets}/svg/logo-horizontal.svg`,
      mark: `${baseAssets}/svg/logo-mark.svg`
    },
    tokens: runtime.tokens
  };
}
