import {NextRequest, NextResponse} from 'next/server';
import {
  computeProgress,
  hydrateJobState,
  readContextJobs,
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

  return NextResponse.json({
    traceId,
    phaseA: 'ready',
    phaseB: hydrated.phaseBStatus,
    progress: computeProgress(hydrated),
    agents: hydrated.agents
  });
}
