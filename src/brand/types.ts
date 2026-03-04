export type BrandRuntime = {
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
  assets: {
    logo: string;
    mark: string;
  };
  tokens: {
    primary: string;
    secondary: string;
    citizen: string;
    neutral: string;
    background: string;
  };
};

export type BrandResolutionInput = {
  host?: string;
  pathname?: string;
  tenant?: string | null;
  brandHint?: string | null;
};

export type BrandResolutionResult = {
  brand_id: string;
  reason: 'tenant' | 'hint' | 'host' | 'route' | 'fallback';
};
