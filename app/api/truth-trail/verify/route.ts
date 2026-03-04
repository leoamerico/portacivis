import {NextResponse} from 'next/server';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {type TruthTrailAuditEvent, validateChain} from '../../../lib/truthTrailAudit';

export const runtime = 'nodejs';

// Espelha a lógica de AUDIT_FILE: em produção lê /tmp primeiro, cai de volta
// no semente bundled se /tmp ainda não existir (cold-start).
const AUDIT_FILE_TMP = '/tmp/portacivis-audit/truth-trail-chain.json';
const AUDIT_FILE_SEED = path.join(process.cwd(), 'governance', 'audit', 'truth-trail-chain.json');
const AUDIT_FILE = process.env.NODE_ENV === 'production' ? AUDIT_FILE_TMP : AUDIT_FILE_SEED;

async function readChain(): Promise<TruthTrailAuditEvent[]> {
  // Em produção: tenta /tmp primeiro (escrito após POs), depois o semente bundled
  if (process.env.NODE_ENV === 'production') {
    try {
      const raw = await readFile(AUDIT_FILE_TMP, 'utf8');
      const parsed = JSON.parse(raw) as TruthTrailAuditEvent[];
      if (Array.isArray(parsed)) return parsed;
    } catch { /* /tmp não existe ainda — cold start */ }
  }
  try {
    const raw = await readFile(AUDIT_FILE_SEED, 'utf8');
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
