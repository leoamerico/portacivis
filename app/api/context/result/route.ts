import {NextRequest, NextResponse} from 'next/server';
import {
  hydrateJobState,
  readContextJobs,
  recordContextAuditEvent,
  writeContextJobs
} from '../../../lib/contextOrchestration';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const traceId = request.nextUrl.searchParams.get('traceId')?.trim() ?? '';

  if (!traceId) {
    return NextResponse.json({success: false, error: 'Missing query param: traceId'}, {status: 400});
  }

  const jobs = await readContextJobs();
  const found = jobs[traceId];

  if (!found) {
    return NextResponse.json({success: false, error: 'Trace not found'}, {status: 404});
  }

  const hydrated = hydrateJobState(found);
  if (hydrated !== found) {
    jobs[traceId] = hydrated;
    await writeContextJobs(jobs);
  }

  if (hydrated.phaseBStatus === 'cancelled') {
    return NextResponse.json(
      {
        success: false,
        error: 'Job cancelled',
        traceId,
        phaseB: 'cancelled'
      },
      {status: 409}
    );
  }

  if (hydrated.phaseBStatus !== 'ready') {
    return NextResponse.json(
      {
        success: true,
        traceId,
        phaseB: hydrated.phaseBStatus
      },
      {status: 202}
    );
  }

  await recordContextAuditEvent({
    eventType: 'CONTEXT_RESULT_READY',
    action: 'context_result_read',
    correlationId: hydrated.context.cityCode,
    traceId,
    classification: 'publico',
    payload: {
      contextKey: hydrated.contextKey,
      source: hydrated.source,
      layers: hydrated.layers,
      phase: 'B'
    }
  });

  return NextResponse.json(hydrated.phaseB);
}
