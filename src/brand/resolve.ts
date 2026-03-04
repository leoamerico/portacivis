import {BRAND_INDEX} from './registry.generated';
import type {BrandResolutionInput, BrandResolutionResult} from './types';

function hasBrand(id: string): boolean {
  return BRAND_INDEX.has(id.toUpperCase() as never);
}

function normalizeHost(host?: string) {
  if (!host) {
    return '';
  }

  return host.split(':')[0].trim().toLowerCase();
}

export function resolveBrand(input: BrandResolutionInput): BrandResolutionResult {
  const host = normalizeHost(input.host);
  const pathname = (input.pathname ?? '/').toLowerCase();
  const tenant = (input.tenant ?? '').trim();
  const brandHint = (input.brandHint ?? '').trim();

  if (tenant) {
    if (tenant.toUpperCase().startsWith('TENANT_GOVEVIA')) {
      return {brand_id: 'GOVEVIA', reason: 'tenant'};
    }

    if (tenant.toUpperCase().startsWith('TENANT_PORTACIVIS')) {
      return {brand_id: 'PORTACIVIS', reason: 'tenant'};
    }
  }

  if (brandHint && hasBrand(brandHint)) {
    return {brand_id: brandHint.toUpperCase(), reason: 'hint'};
  }

  if (host === 'leoamerico.me' || host.endsWith('.leoamerico.me')) {
    return {brand_id: 'LEOAMERICO', reason: 'host'};
  }

  if (host.includes('portacivis')) {
    return {brand_id: 'PORTACIVIS', reason: 'host'};
  }

  if (host.includes('govevia')) {
    return {brand_id: 'GOVEVIA', reason: 'host'};
  }

  if (host.includes('envlive') || host.includes('env-live')) {
    return {brand_id: 'ENVLIVE', reason: 'host'};
  }

  if (pathname.startsWith('/plataforma')) {
    return {brand_id: 'GOVEVIA', reason: 'route'};
  }

  if (pathname.startsWith('/civis') || pathname.startsWith('/verificacao-auditoria')) {
    return {brand_id: 'PORTACIVIS', reason: 'route'};
  }

  return {brand_id: 'PORTACIVIS', reason: 'fallback'};
}
