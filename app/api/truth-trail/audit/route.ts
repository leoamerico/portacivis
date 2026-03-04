import {NextRequest, NextResponse} from 'next/server';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {
  computeEventHash,
  type TruthTrailAuditEvent,
  type TruthTrailAuditInput,
  validateChain
} from '../../../lib/truthTrailAudit';

export const runtime = 'nodejs';

// Em ambientes serverless (Vercel) o diretório do projeto é somente-leitura.
// Usamos /tmp para gravação em produção, e o diretório do projeto em dev,
// onde o arquivo bundled serve como semente inicial.
const AUDIT_DIR =
  process.env.NODE_ENV === 'production'
    ? '/tmp/portacivis-audit'
    : path.join(process.cwd(), 'governance', 'audit');

const AUDIT_FILE = path.join(AUDIT_DIR, 'truth-trail-chain.json');

// Arquivo semente bundled (leitura em desenvolvimento ou cold-start em produção)
const SEED_FILE = path.join(process.cwd(), 'governance', 'audit', 'truth-trail-chain.json');

async function readChain(): Promise<TruthTrailAuditEvent[]> {
  // Tenta ler do destino de escrita (tmp em prod, projeto em dev)
  try {
    const raw = await readFile(AUDIT_FILE, 'utf8');
    const parsed = JSON.parse(raw) as TruthTrailAuditEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Em produção (cold-start), tenta o arquivo semente bundled
    if (process.env.NODE_ENV === 'production' && SEED_FILE !== AUDIT_FILE) {
      try {
        const raw = await readFile(SEED_FILE, 'utf8');
        const parsed = JSON.parse(raw) as TruthTrailAuditEvent[];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
}

async function writeChain(chain: TruthTrailAuditEvent[]) {
  await mkdir(AUDIT_DIR, {recursive: true});
  await writeFile(AUDIT_FILE, JSON.stringify(chain, null, 2), 'utf8');
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<TruthTrailAuditInput>;

    const requiredFields: Array<keyof TruthTrailAuditInput> = [
      'eventId',
      'eventType',
      'actorId',
      'delegationId',
      'timestamp',
      'action',
      'payloadHash',
      'correlationId',
      'traceId',
      'classification',
      'previousHash'
    ];

    const missing = requiredFields.filter((field) => !body[field]);
    if (missing.length > 0) {
      return NextResponse.json({success: false, error: `Missing fields: ${missing.join(', ')}`}, {status: 400});
    }

    const input: TruthTrailAuditInput = {
      eventId: String(body.eventId),
      eventType: String(body.eventType),
      actorId: String(body.actorId),
      delegationId: String(body.delegationId),
      timestamp: String(body.timestamp),
      action: String(body.action),
      payloadHash: String(body.payloadHash),
      correlationId: String(body.correlationId),
      traceId: String(body.traceId),
      classification: String(body.classification),
      previousHash: String(body.previousHash)
    };
    const chain = await readChain();

    const duplicate = chain.find(
      (event) =>
        event.eventType === input.eventType &&
        event.correlationId === input.correlationId &&
        event.traceId === input.traceId
    );

    if (duplicate) {
      return NextResponse.json({
        success: true,
        deduplicated: true,
        hash: duplicate.hash,
        chainLength: chain.length
      });
    }

    const expectedPreviousHash = chain.length > 0 ? chain[chain.length - 1].hash : 'GENESIS';
    if (input.previousHash !== expectedPreviousHash) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid previousHash for current chain head',
          expectedPreviousHash
        },
        {status: 409}
      );
    }

    const hash = computeEventHash(input);
    const event: TruthTrailAuditEvent = {
      eventId: input.eventId,
      eventType: input.eventType,
      actorId: input.actorId,
      delegationId: input.delegationId,
      timestamp: input.timestamp,
      action: input.action,
      payloadHash: input.payloadHash,
      correlationId: input.correlationId,
      traceId: input.traceId,
      classification: input.classification,
      previousHash: input.previousHash,
      hash
    };

    const nextChain = [...chain, event];
    const validation = validateChain(nextChain);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Chain validation failed before persistence',
          issues: validation.issues
        },
        {status: 422}
      );
    }

    await writeChain(nextChain);

    return NextResponse.json({
      success: true,
      deduplicated: false,
      hash,
      chainLength: nextChain.length
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to persist truth trail audit event on server'
      },
      {status: 500}
    );
  }
}
