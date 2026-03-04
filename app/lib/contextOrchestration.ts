import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {
  computeEventHash,
  sha256Hex,
  type TruthTrailAuditEvent,
  type TruthTrailAuditInput
} from './truthTrailAudit';

export type ContextSelection = {
  country: string;
  state: string;
  city: string;
  cityCode: string;
  lat?: number;
  lng?: number;
  source?: string;
};

export type ContextPhaseA = {
  traceId: string;
  phase: 'A';
  summary: string;
  highlights: string[];
  recommendedActions: string[];
  confidence: number;
  expiresAt: string;
};

export type ContextPhaseB = {
  traceId: string;
  phase: 'B';
  panorama: {
    services: string[];
    alerts: string[];
    compliance: string[];
    mobility: string[];
  };
  evidence: Array<{
    title: string;
    url: string;
    collectedAt: string;
  }>;
  nextActs: string[];
  audit: {
    truthTrailHash: string;
    chainPosition: number;
  };
  warnings?: string[];
};

export type ContextJob = {
  traceId: string;
  locale: string;
  context: ContextSelection;
  layers: string[];
  source: string;
  contextKey: string;
  createdAt: string;
  updatedAt: string;
  phaseA: ContextPhaseA;
  phaseB: ContextPhaseB;
  phaseBStatus: 'running' | 'ready' | 'failed' | 'cancelled';
  availableAt: string;
  cancelledAt?: string;
  warnings?: string[];
  agents: Record<'news' | 'services' | 'compliance' | 'mobility', 'queued' | 'running' | 'done' | 'failed'>;
};

const GOVERNANCE_DIR = path.join(process.cwd(), 'governance');
const CONTEXT_DIR = path.join(GOVERNANCE_DIR, 'context');
const CONTEXT_FILE = path.join(CONTEXT_DIR, 'context-jobs.json');
const AUDIT_DIR = path.join(GOVERNANCE_DIR, 'audit');
const AUDIT_FILE = path.join(AUDIT_DIR, 'truth-trail-chain.json');

function normalizeLayers(layers: string[]) {
  return [...new Set(layers.map((value) => value.trim()).filter(Boolean))].sort();
}

function mockNumber(seed: string, offset: number, min: number, max: number) {
  const chunk = seed.slice(offset, offset + 6);
  const numeric = Number.parseInt(chunk || '0', 16);
  const range = max - min + 1;
  return min + (numeric % range);
}

export function computeContextKey(
  context: ContextSelection,
  layers: string[],
  locale: string
) {
  const base = [
    context.country,
    context.state,
    context.cityCode,
    normalizeLayers(layers).join(','),
    locale
  ].join('|');

  return sha256Hex(base);
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, payload: unknown) {
  await mkdir(path.dirname(filePath), {recursive: true});
  await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8');
}

export async function readContextJobs() {
  return readJsonFile<Record<string, ContextJob>>(CONTEXT_FILE, {});
}

export async function writeContextJobs(jobs: Record<string, ContextJob>) {
  await writeJsonFile(CONTEXT_FILE, jobs);
}

async function readChain(): Promise<TruthTrailAuditEvent[]> {
  return readJsonFile<TruthTrailAuditEvent[]>(AUDIT_FILE, []);
}

async function writeChain(chain: TruthTrailAuditEvent[]) {
  await mkdir(AUDIT_DIR, {recursive: true});
  await writeFile(AUDIT_FILE, JSON.stringify(chain, null, 2), 'utf8');
}

export async function recordContextAuditEvent(params: {
  eventType: string;
  action: string;
  correlationId: string;
  traceId: string;
  classification: string;
  payload: unknown;
}) {
  const chain = await readChain();

  const duplicate = chain.find(
    (event) =>
      event.eventType === params.eventType &&
      event.correlationId === params.correlationId &&
      event.traceId === params.traceId
  );

  if (duplicate) {
    return {hash: duplicate.hash, chainPosition: chain.length, deduplicated: true};
  }

  const previousHash = chain.length > 0 ? chain[chain.length - 1].hash : 'GENESIS';
  const payloadHash = sha256Hex(JSON.stringify(params.payload));

  const input: TruthTrailAuditInput = {
    eventId: `evt-${randomUUID()}`,
    eventType: params.eventType,
    actorId: 'visitor-anonymous',
    delegationId: 'none',
    timestamp: new Date().toISOString(),
    action: params.action,
    payloadHash,
    correlationId: params.correlationId,
    traceId: params.traceId,
    classification: params.classification,
    previousHash
  };

  const hash = computeEventHash(input);
  const event: TruthTrailAuditEvent = {...input, hash};

  await writeChain([...chain, event]);

  return {
    hash,
    chainPosition: chain.length + 1,
    deduplicated: false
  };
}

export function buildContextPhaseA(params: {
  traceId: string;
  context: ContextSelection;
  layers: string[];
  locale: string;
  contextKey: string;
}) {
  const {traceId, context, contextKey} = params;
  const alerts = mockNumber(contextKey, 0, 0, 4);
  const services = mockNumber(contextKey, 6, 1, 3);
  const confidenceRaw = mockNumber(contextKey, 12, 72, 96) / 100;

  return {
    traceId,
    phase: 'A' as const,
    summary: `Em ${context.city}, ${alerts} alertas ativos e ${services} serviços prioritários exigem atenção imediata.`,
    highlights: [
      `${alerts} alertas com impacto local nas últimas 24h`,
      `${services} serviços públicos em prioridade operacional`
    ],
    recommendedActions: ['Ver serviços prioritários', 'Abrir trilha de verificação'],
    confidence: Number(confidenceRaw.toFixed(2)),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  };
}

export function buildContextPhaseB(params: {
  traceId: string;
  context: ContextSelection;
  contextKey: string;
  auditHash: string;
  chainPosition: number;
}) {
  const {traceId, context, contextKey, auditHash, chainPosition} = params;
  const hasWarning = mockNumber(contextKey, 18, 0, 10) <= 2;

  return {
    traceId,
    phase: 'B' as const,
    panorama: {
      services: [
        `Fila de atendimento municipal em ${context.city} acima da meta em 1 serviço`,
        'Dois serviços com atualização operacional prevista para hoje'
      ],
      alerts: ['Alerta de utilidade pública em monitoramento', 'Boletim local revisado por fonte oficial'],
      compliance: ['Sem violação crítica de política no recorte atual', 'Pendência de revisão em item não bloqueante'],
      mobility: ['Trânsito com impacto moderado em horários de pico', 'Sem bloqueio total de vias estratégicas']
    },
    evidence: [
      {
        title: 'Painel municipal consolidado',
        url: 'https://www.portacivis.com.br/verificacao-auditoria',
        collectedAt: new Date().toISOString()
      }
    ],
    nextActs: ['Registrar manifestação', 'Iniciar verificação de política pública'],
    audit: {
      truthTrailHash: auditHash,
      chainPosition
    },
    warnings: hasWarning ? ['Resposta parcial em uma camada temática.'] : undefined
  };
}

export function buildInitialAgentStatuses(contextKey: string): ContextJob['agents'] {
  const mode = mockNumber(contextKey, 24, 0, 3);

  if (mode === 0) {
    return {news: 'done', services: 'running', compliance: 'queued', mobility: 'done'};
  }

  if (mode === 1) {
    return {news: 'running', services: 'running', compliance: 'queued', mobility: 'queued'};
  }

  if (mode === 2) {
    return {news: 'done', services: 'done', compliance: 'running', mobility: 'queued'};
  }

  return {news: 'running', services: 'done', compliance: 'running', mobility: 'done'};
}

export function hydrateJobState(job: ContextJob): ContextJob {
  const now = Date.now();

  if (job.phaseBStatus === 'running' && now >= Date.parse(job.availableAt)) {
    return {
      ...job,
      updatedAt: new Date().toISOString(),
      phaseBStatus: 'ready',
      agents: {
        news: 'done',
        services: 'done',
        compliance: 'done',
        mobility: 'done'
      }
    };
  }

  return job;
}

export function computeProgress(job: ContextJob) {
  const values = Object.values(job.agents);
  const doneCount = values.filter((value) => value === 'done').length;
  const failedCount = values.filter((value) => value === 'failed').length;

  if (job.phaseBStatus === 'cancelled') {
    return 0;
  }

  if (job.phaseBStatus === 'ready') {
    return 100;
  }

  const ratio = ((doneCount + failedCount * 0.5) / values.length) * 100;
  return Math.max(5, Math.min(95, Math.round(ratio)));
}
