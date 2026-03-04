import {NextResponse} from 'next/server';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {type TruthTrailAuditEvent, validateChain} from '../../../lib/truthTrailAudit';

export const runtime = 'nodejs';

const AUDIT_FILE = path.join(process.cwd(), 'governance', 'audit', 'truth-trail-chain.json');

async function readChain(): Promise<TruthTrailAuditEvent[]> {
  try {
    const raw = await readFile(AUDIT_FILE, 'utf8');
    const parsed = JSON.parse(raw) as TruthTrailAuditEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const chain = await readChain();
  const validation = validateChain(chain);
  const head = chain.length > 0 ? chain[chain.length - 1].hash : 'GENESIS';

  return NextResponse.json({
    success: validation.valid,
    chainLength: chain.length,
    head,
    issues: validation.issues
  });
}
