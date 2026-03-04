import {NextRequest, NextResponse} from 'next/server';
import {randomUUID} from 'node:crypto';
import {
  buildContextPhaseA,
  buildContextPhaseB,
  buildInitialAgentStatuses,
  computeContextKey,
  recordContextAuditEvent,
  readContextJobs,
  type ContextSelection,
  writeContextJobs
} from '../../../lib/contextOrchestration';

export const runtime = 'nodejs';

type SelectRequestBody = {
  traceId?: string;
  locale?: string;
  context?: Partial<ContextSelection>;
  layers?: string[];
  source?: string;
};

function normalizeContext(raw?: Partial<ContextSelection>) {
  return {
    country: String(raw?.country ?? 'BR'),
    state: String(raw?.state ?? '').trim(),
    city: String(raw?.city ?? '').trim(),
    cityCode: String(raw?.cityCode ?? '').trim(),
    lat: typeof raw?.lat === 'number' ? raw.lat : undefined,
    lng: typeof raw?.lng === 'number' ? raw.lng : undefined,
    source: String(raw?.source ?? 'map_click')
  } satisfies ContextSelection;
}

function validateContext(context: ContextSelection) {
  const missing: string[] = [];

  if (!context.state) missing.push('context.state');
  if (!context.city) missing.push('context.city');
  if (!context.cityCode) missing.push('context.cityCode');

  return missing;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SelectRequestBody;
    const traceId = String(body.traceId ?? randomUUID());
    const locale = String(body.locale ?? 'pt-BR');
    const source = String(body.source ?? 'home_map');
    const layers = Array.isArray(body.layers)
      ? body.layers.map((value) => String(value).trim()).filter(Boolean)
      : [];

    const context = normalizeContext(body.context);
    const missing = validateContext(context);

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missing.join(', ')}`
        },
        {status: 400}
      );
    }

    const contextKey = computeContextKey(context, layers, locale);
    const jobs = await readContextJobs();
    const existing = jobs[traceId];

    if (existing) {
      return NextResponse.json({
        traceId,
        phase: 'A',
        summary: existing.phaseA.summary,
        highlights: existing.phaseA.highlights,
        recommendedActions: existing.phaseA.recommendedActions,
        confidence: existing.phaseA.confidence,
        expiresAt: existing.phaseA.expiresAt,
        prewarm: {
          jobId: traceId,
          status: existing.phaseBStatus === 'cancelled' ? 'cancelled' : 'started'
        }
      });
    }

    const audit = await recordContextAuditEvent({
      eventType: 'CONTEXT_SELECTED',
      action: 'context_selected',
      correlationId: context.cityCode,
      traceId,
      classification: 'publico',
      payload: {locale, context, layers, source}
    });

    const phaseA = buildContextPhaseA({
      traceId,
      context,
      layers,
      locale,
      contextKey
    });

    const phaseB = buildContextPhaseB({
      traceId,
      context,
      contextKey,
      auditHash: audit.hash,
      chainPosition: audit.chainPosition
    });

    jobs[traceId] = {
      traceId,
      locale,
      context,
      layers,
      source,
      contextKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phaseA,
      phaseB,
      phaseBStatus: 'running',
      availableAt: new Date(Date.now() + 3000).toISOString(),
      agents: buildInitialAgentStatuses(contextKey)
    };

    await writeContextJobs(jobs);

    return NextResponse.json({
      traceId,
      phase: 'A',
      summary: phaseA.summary,
      highlights: phaseA.highlights,
      recommendedActions: phaseA.recommendedActions,
      confidence: phaseA.confidence,
      expiresAt: phaseA.expiresAt,
      prewarm: {
        jobId: traceId,
        status: 'started'
      }
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to process context selection'
      },
      {status: 500}
    );
  }
}
