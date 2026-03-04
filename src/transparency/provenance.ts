/**
 * Module 1 — Data provenance, staleness detection, permalink generation and PDF export.
 */
import type {
  DataProvenance,
  DataSource,
  DataChange,
  StalenessAlert,
  TrailPermalink,
  TrailExportData,
} from './types';

// ── Simulated data sources (would come from API in production) ────────────────

const KNOWN_SOURCES: DataSource[] = [
  { id: 'src-portal-transparencia', name: 'Portal da Transparência', url: 'https://portaldatransparencia.gov.br', type: 'portal_transparencia' },
  { id: 'src-ibge', name: 'IBGE — Cidades', url: 'https://cidades.ibge.gov.br', type: 'ibge' },
  { id: 'src-tcu', name: 'Tribunal de Contas da União', url: 'https://portal.tcu.gov.br', type: 'tcu' },
  { id: 'src-diario-oficial', name: 'Diário Oficial do Município', url: 'https://diariooficial.exemplo.gov.br', type: 'diario_oficial' },
  { id: 'src-esic', name: 'e-SIC — Sistema de Informação ao Cidadão', url: 'https://esic.exemplo.gov.br', type: 'esic' },
];

export function getKnownSources(): DataSource[] {
  return KNOWN_SOURCES;
}

// ── Hash generation ───────────────────────────────────────────────────────────

async function sha256(content: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const data = new TextEncoder().encode(content);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for environments without crypto.subtle
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const chr = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

// ── Provenance builder ────────────────────────────────────────────────────────

export async function buildProvenance(
  sourceId: string,
  content: string,
  previousChanges: DataChange[] = []
): Promise<DataProvenance> {
  const source = KNOWN_SOURCES.find(s => s.id === sourceId);
  if (!source) {
    throw new Error(`Unknown source: ${sourceId}`);
  }
  const now = new Date().toISOString();
  const contentHash = await sha256(content + now);

  return {
    id: `prov-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    source,
    lastUpdated: now,
    capturedAt: now,
    contentHash,
    changeHistory: previousChanges,
  };
}

// ── Staleness detection ───────────────────────────────────────────────────────

const DEFAULT_THRESHOLD_DAYS: Record<string, number> = {
  portal_transparencia: 30,
  diario_oficial: 30,
  ibge: 90,
  tcu: 60,
  esic: 30,
  lai: 30,
  outro: 30,
};

export function detectStaleness(
  provenances: DataProvenance[],
  thresholdOverrides: Record<string, number> = {}
): StalenessAlert[] {
  const now = Date.now();
  const alerts: StalenessAlert[] = [];

  for (const prov of provenances) {
    const threshold = thresholdOverrides[prov.source.type] ?? DEFAULT_THRESHOLD_DAYS[prov.source.type] ?? 30;
    const lastUpdate = new Date(prov.lastUpdated).getTime();
    const daysSince = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

    if (daysSince >= threshold) {
      alerts.push({
        sourceId: prov.source.id,
        sourceName: prov.source.name,
        lastUpdated: prov.lastUpdated,
        thresholdDays: threshold,
        daysSinceUpdate: daysSince,
        severity: daysSince >= threshold * 2 ? 'critical' : 'warning',
      });
    }
  }

  return alerts;
}

// ── Permalink generation ──────────────────────────────────────────────────────

export async function generatePermalink(
  title: string,
  city: string,
  uf: string,
  layers: string[],
  provenances: DataProvenance[]
): Promise<TrailPermalink> {
  const now = new Date().toISOString();
  const snapshotContent = JSON.stringify({ city, uf, layers, provenances, timestamp: now });
  const snapshotHash = await sha256(snapshotContent);

  return {
    id: `trail-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    city,
    uf,
    createdAt: now,
    snapshotHash,
    layers,
    provenances,
    expiresAt: null,
  };
}

// ── PDF export data builder ───────────────────────────────────────────────────

export async function buildExportData(
  title: string,
  city: string,
  uf: string,
  layers: string[],
  provenances: DataProvenance[],
  stalenessAlerts: StalenessAlert[]
): Promise<TrailExportData> {
  const now = new Date().toISOString();
  const signatureContent = JSON.stringify({ title, city, uf, layers, provenances, timestamp: now });
  const signatureHash = await sha256(signatureContent);

  return {
    title,
    city,
    uf,
    generatedAt: now,
    layers,
    provenances,
    stalenessAlerts,
    signatureHash,
  };
}

// ── Demo provenances for Cidade Aurora ────────────────────────────────────────

export function buildDemoProvenances(): DataProvenance[] {
  const now = new Date();
  const recent = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();
  const stale = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString();
  const veryStale = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 'prov-demo-1',
      source: KNOWN_SOURCES[0], // Portal da Transparência
      lastUpdated: recent,
      capturedAt: recent,
      contentHash: 'a1b2c3d4e5f6789012345678abcdef01',
      changeHistory: [
        { date: recent, description: 'Atualização de dados fiscais do 4º bimestre', previousHash: 'prev001', newHash: 'a1b2c3d4e5f6789012345678abcdef01' }
      ],
    },
    {
      id: 'prov-demo-2',
      source: KNOWN_SOURCES[1], // IBGE
      lastUpdated: recent,
      capturedAt: recent,
      contentHash: 'b2c3d4e5f678901234567890bcdef012',
      changeHistory: [],
    },
    {
      id: 'prov-demo-3',
      source: KNOWN_SOURCES[2], // TCU
      lastUpdated: stale,
      capturedAt: stale,
      contentHash: 'c3d4e5f67890123456789012cdef0123',
      changeHistory: [],
    },
    {
      id: 'prov-demo-4',
      source: KNOWN_SOURCES[3], // Diário Oficial
      lastUpdated: recent,
      capturedAt: recent,
      contentHash: 'd4e5f6789012345678901234def01234',
      changeHistory: [
        { date: recent, description: 'Publicação do Decreto Municipal nº 1.234/2026', previousHash: 'prev004', newHash: 'd4e5f6789012345678901234def01234' }
      ],
    },
    {
      id: 'prov-demo-5',
      source: KNOWN_SOURCES[4], // e-SIC
      lastUpdated: veryStale,
      capturedAt: veryStale,
      contentHash: 'e5f678901234567890123456ef012345',
      changeHistory: [],
    },
  ];
}
