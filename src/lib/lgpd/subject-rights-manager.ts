import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID, createHash} from 'node:crypto';
import {
  computeEventHash,
  sha256Hex,
  type TruthTrailAuditEvent,
  type TruthTrailAuditInput
} from '../../../app/lib/truthTrailAudit';

export type RightType =
  | 'access'
  | 'rectify'
  | 'anonymize'
  | 'portability'
  | 'delete'
  | 'consent'
  | 'oppose';

export type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export type SubjectRequest = {
  id: string;
  date: string;
  userId: string;
  rightType: RightType;
  status: RequestStatus;
  deadline: string;
  responseDate?: string;
  dpoNotified: boolean;
  notes?: string;
  payload?: Record<string, unknown>;
};

export type SubjectRightsLog = {
  version: string;
  requests: SubjectRequest[];
};

const GOVERNANCE_DIR = path.join(process.cwd(), 'governance');
const AUDIT_DIR = path.join(GOVERNANCE_DIR, 'audit');
const REQUESTS_FILE = path.join(AUDIT_DIR, 'lgpd-requests.json');
const AUDIT_FILE = path.join(AUDIT_DIR, 'truth-trail-chain.json');

const DPO_DEADLINE_DAYS = 15;

export function anonymizeUserId(rawId: string): string {
  return createHash('sha256').update(rawId).digest('hex').slice(0, 32);
}

export function computeDeadline(fromDate: string): string {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + DPO_DEADLINE_DAYS);
  return date.toISOString();
}

export function getDaysRemaining(request: SubjectRequest): number {
  const now = new Date();
  const deadline = new Date(request.deadline);
  return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isOverdue(request: SubjectRequest): boolean {
  return (
    new Date() > new Date(request.deadline) &&
    request.status !== 'completed' &&
    request.status !== 'rejected'
  );
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, payload: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), {recursive: true});
  await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8');
}

async function readChain(): Promise<TruthTrailAuditEvent[]> {
  return readJsonFile<TruthTrailAuditEvent[]>(AUDIT_FILE, []);
}

async function writeChain(chain: TruthTrailAuditEvent[]): Promise<void> {
  await writeJsonFile(AUDIT_FILE, chain);
}

async function appendAuditEvent(input: {
  eventType: string;
  action: string;
  correlationId: string;
  traceId: string;
  payload: Record<string, unknown>;
}): Promise<TruthTrailAuditEvent> {
  const chain = await readChain();
  const previousHash = chain.length > 0 ? chain[chain.length - 1].hash : 'GENESIS';
  const timestamp = new Date().toISOString();
  const payloadHash = sha256Hex(JSON.stringify(input.payload));

  const auditInput: TruthTrailAuditInput = {
    eventId: randomUUID(),
    eventType: input.eventType,
    actorId: 'visitor-anonymous',
    delegationId: 'self',
    timestamp,
    action: input.action,
    payloadHash,
    correlationId: input.correlationId,
    traceId: input.traceId,
    classification: 'restrito',
    previousHash
  };

  const hash = computeEventHash(auditInput);
  const event: TruthTrailAuditEvent = {...auditInput, hash};

  chain.push(event);
  await writeChain(chain);

  return event;
}

export async function readRequestsLog(): Promise<SubjectRightsLog> {
  return readJsonFile<SubjectRightsLog>(REQUESTS_FILE, {version: '1.0', requests: []});
}

async function writeRequestsLog(log: SubjectRightsLog): Promise<void> {
  await writeJsonFile(REQUESTS_FILE, log);
}

export async function createSubjectRequest(params: {
  rawUserId: string;
  rightType: RightType;
  payload?: Record<string, unknown>;
}): Promise<SubjectRequest> {
  const log = await readRequestsLog();
  const now = new Date().toISOString();
  const userId = anonymizeUserId(params.rawUserId);
  const traceId = randomUUID();
  const seqNum = String(log.requests.length + 1).padStart(3, '0');

  const request: SubjectRequest = {
    id: `REQ-${new Date().getFullYear()}-${seqNum}`,
    date: now,
    userId,
    rightType: params.rightType,
    status: 'pending',
    deadline: computeDeadline(now),
    dpoNotified: true,
    payload: params.payload
  };

  log.requests.push(request);
  await writeRequestsLog(log);

  await appendAuditEvent({
    eventType: 'LGPD_SUBJECT_REQUEST',
    action: `lgpd_${params.rightType}_request`,
    correlationId: request.id,
    traceId,
    payload: {
      requestId: request.id,
      rightType: params.rightType,
      userId,
      deadline: request.deadline,
      dpoNotified: true
    }
  });

  return request;
}

export async function getRequestsByUser(rawUserId: string): Promise<SubjectRequest[]> {
  const userId = anonymizeUserId(rawUserId);
  const log = await readRequestsLog();
  return log.requests.filter((r) => r.userId === userId);
}

export async function getPendingRequests(): Promise<SubjectRequest[]> {
  const log = await readRequestsLog();
  return log.requests.filter(
    (r) => r.status === 'pending' || r.status === 'in_progress'
  );
}

export async function getOverdueRequests(): Promise<SubjectRequest[]> {
  const pending = await getPendingRequests();
  return pending.filter(isOverdue);
}
