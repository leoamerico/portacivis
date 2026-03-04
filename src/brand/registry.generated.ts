/* AUTO-GENERATED FILE — DO NOT EDIT
 * Source: governance/catalog/BRANDS.yml
 * Source-Hash: 0ea7353721b82d7d1f9ac2ae643d2a254dba6e25007d20c556e07d2311e974e8
 */
export type BrandId = "GOVEVIA" | "PORTACIVIS" | "ENVLIVE" | "LEOAMERICO";

export const BRANDS = [
  {
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
    "brand_id": "PORTACIVIS",
    "name": "PortaCivis",
    "category": "civic_information_portal",
    "slogan": "Informação pública para todos os cidadãos",
    "owner": "ENVNEO",
    "assets_path": "public/brands/portacivis/",
    "tokens_path": "tokens/brands/portacivis/",
    "docs_path": "docs/brand/PORTACIVIS/",
    "governance": {
      "adr": "ADR-0042-brand-multiverse-architecture",
      "compliance_case": "CC-BRAND-PORTACIVIS"
    }
  },
  {
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
