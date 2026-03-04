# ADR-0042 — Brand Multiverse Architecture

Status: Accepted  
Date: 2026-03-04  
Owner: ENV-NEO LTDA  

## Context

The EnvNeo ecosystem operates multiple brands serving different domains:

- Govevia → GovTech platform for public administration
- PortaCivis → civic information portal for citizens
- Env Live → private-sector platform and marketplace
- leoamerico.me → personal institutional brand of the founder

EnvNeo itself is the corporate entity and governance owner but intentionally
does not operate as a public-facing brand.

Without formal governance, multi-brand ecosystems tend to suffer from:

- inconsistent visual identity
- duplicated assets
- hardcoded styling in frontends
- uncontrolled modifications to logos and slogans
- lack of traceability of brand changes

To prevent these issues, brand assets must be governed as versioned artifacts.

## Decision

The EnvNeo ecosystem adopts a **Brand Multiverse Architecture**.

In this architecture:

1. Each brand is defined as a **governed artifact** in the governance catalog.
2. Brand identity is distributed as **Brand-as-Code**:
   - tokens
   - assets
   - documentation
   - registry entries
3. Frontend systems must consume brand identity through **tokens and manifests**, not hardcoded values.
4. Brand compliance must be verified via CI/CD governance gates.

## Brand Registry

The canonical list of brands is maintained in:

```
governance/catalog/BRANDS.yml
```

Each brand entry must define:

- brand_id
- name
- slogan
- category
- asset paths
- token paths
- documentation references
- governance references

## Brand Distribution

Brand assets are distributed through:

```
public/brands/{brand_id}/
tokens/brands/{brand_id}/
docs/brand/{brand_id}/
```

Frontend components must consume tokens via the Brand Provider.

## Enforcement

Brand governance is enforced via compliance cases:

```
governance/compliance-cases/CC-BRAND-{brand_id}
```

These controls validate:

- asset presence
- token integrity
- documentation completeness
- compliance with catalog definition

## Consequences

Benefits:

- consistent identity across portals
- reproducible brand assets
- auditability of brand changes
- safe scaling of multi-brand ecosystem

Trade-offs:

- additional governance structure
- CI/CD validation overhead

These trade-offs are acceptable in exchange for long-term maintainability.

## Principle

In the EnvNeo ecosystem:

> A brand is not a graphic asset.  
> It is a governed system artifact.
