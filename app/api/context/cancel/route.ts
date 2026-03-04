import {NextRequest, NextResponse} from 'next/server';
import {
  readContextJobs,
  recordContextAuditEvent,
  writeContextJobs
} from '../../../lib/contextOrchestration';

export const runtime = 'nodejs';

type CancelBody = {
  traceId?: string;
  reason?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CancelBody;
    const traceId = String(body.traceId ?? '').trim();

    if (!traceId) {
      return NextResponse.json({success: false, error: 'Missing field: traceId'}, {status: 400});
    }

    const jobs = await readContextJobs();
    const found = jobs[traceId];

    if (!found) {
      return NextResponse.json({success: false, error: 'Trace not found'}, {status: 404});
    }

    jobs[traceId] = {
      ...found,
      updatedAt: new Date().toISOString(),
      cancelledAt: new Date().toISOString(),
      phaseBStatus: 'cancelled',
      agents: {
        news: found.agents.news === 'done' ? 'done' : 'failed',
        services: found.agents.services === 'done' ? 'done' : 'failed',
        compliance: found.agents.compliance === 'done' ? 'done' : 'failed',
        mobility: found.agents.mobility === 'done' ? 'done' : 'failed'
      },
      warnings: [...(found.warnings ?? []), `Cancelled: ${String(body.reason ?? 'no reason provided')}`]
    };

    await writeContextJobs(jobs);

    const audit = await recordContextAuditEvent({
      eventType: 'CONTEXT_CANCELLED',
      action: 'context_cancelled',
      correlationId: found.context.cityCode,
      traceId,
      classification: 'publico',
      payload: {
        reason: String(body.reason ?? 'not provided'),
        contextKey: found.contextKey
      }
    });

    return NextResponse.json({
      success: true,
      traceId,
      status: 'cancelled',
      auditHash: audit.hash
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to cancel context job'
      },
      {status: 500}
    );
  }
}
