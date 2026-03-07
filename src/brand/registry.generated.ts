/* AUTO-GENERATED FILE — DO NOT EDIT
 * Source: governance/catalog/BRANDS.yml
 * Source-Hash: e0883c198689d60088d395315816224bdd6a3dc819e211cc2b6ba4bed31b4bdb
 */
export type BrandId = "GOVEVIA" | "PORTACIVIS" | "ENVLIVE" | "LEOAMERICO";

export const BRANDS = [
  {
    "tokens": {
      "primary": "#0E5A3D",
      "secondary": "#2A8D69",
      "citizen": "#7BCFAF",
      "neutral": "#2F3B36",
      "background": "#FFFFFF"
    },
    "brand_id": "GOVEVIA",
    "name": "Govevia",
    "category": "govtech_platform",
    "slogan": "Governança pública inteligente",
    "owner": "ENVNEO",
    "assets_path": "public/brands/govevia/",
    "tokens_path": "tokens/brands/govevia/",
    "docs_path": "docs/brand/GOVEVIA/",
    "governance": {
      "adr": "ADR-0042-brand-multiverse-architecture",
      "compliance_case": "CC-BRAND-GOVEVIA"
    }
  },
  {
    "tokens": {
      "primary": "#1E5AA8",
      "secondary": "#2F7DD1",
      "citizen": "#F39C12",
      "neutral": "#4A4A4A",
      "background": "#FFFFFF"
    },
    "brand_id": "PORTACIVIS",
    "name": "PortaCivis",
    "category": "civic_information_portal",
    "slogan": "Informação pública para todos os cidadãos",
    "owner": "ENVNEO",
    "assets_path": "public/brand/portacivis/",
    "tokens_path": "tokens/brands/portacivis/",
    "docs_path": "docs/brand/PORTACIVIS/",
    "governance": {
      "adr": "ADR-0042-brand-multiverse-architecture",
      "compliance_case": "CC-BRAND-PORTACIVIS"
    }
  },
  {
    "tokens": {
      "primary": "#4B2CA8",
      "secondary": "#6E4CE0",
      "citizen": "#B6A6FF",
      "neutral": "#3A3150",
      "background": "#FFFFFF"
    },
    "brand_id": "ENVLIVE",
    "name": "Env Live",
    "category": "private_sector_platform",
    "slogan": "Conectando especialistas e organizações",
    "owner": "ENVNEO",
    "assets_path": "public/brands/envlive/",
    "tokens_path": "tokens/brands/envlive/",
    "docs_path": "docs/brand/ENVLIVE/",
    "governance": {
      "adr": "ADR-0042-brand-multiverse-architecture",
      "compliance_case": "CC-BRAND-ENVLIVE"
    }
  },
  {
    "tokens": {
      "primary": "#1E1E1E",
      "secondary": "#3A3A3A",
      "citizen": "#D4A017",
      "neutral": "#4A4A4A",
      "background": "#FFFFFF"
    },
    "brand_id": "LEOAMERICO",
    "name": "leoamerico.me",
    "category": "personal_institutional_brand",
    "slogan": "Tecnologia, governança e arquitetura institucional",
    "owner": "LEONARDO-AMERICO-JOSE-RIBEIRO",
    "assets_path": "public/brands/leoamerico/",
    "tokens_path": "tokens/brands/leoamerico/",
    "docs_path": "docs/brand/LEOAMERICO/",
    "governance": {
      "adr": "ADR-0042-brand-multiverse-architecture",
      "compliance_case": "CC-BRAND-LEOAMERICO"
    }
  }
] as const;

export const BRAND_INDEX = new Map(BRANDS.map((b) => [b.brand_id, b]));
