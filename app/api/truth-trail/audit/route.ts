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

const AUDIT_DIR = path.join(process.cwd(), 'governance', 'audit');
const AUDIT_FILE = path.join(AUDIT_DIR, 'truth-trail-chain.json');

async function readChain(): Promise<TruthTrailAuditEvent[]> {
  try {
    const raw = await readFile(AUDIT_FILE, 'utf8');
    const parsed = JSON.parse(raw) as TruthTrailAuditEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
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

    const input = body as TruthTrailAuditInput;
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
      ...input,
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
