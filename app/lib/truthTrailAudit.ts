import {createHash} from 'node:crypto';

export type TruthTrailAuditEvent = {
  eventId: string;
  eventType: string;
  actorId: string;
  delegationId: string;
  timestamp: string;
  action: string;
  payloadHash: string;
  correlationId: string;
  traceId: string;
  classification: string;
  previousHash: string;
  hash: string;
};

export type TruthTrailAuditInput = Omit<TruthTrailAuditEvent, 'hash'>;

export function sha256Hex(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function computeEventHash(event: TruthTrailAuditInput) {
  return sha256Hex(`${event.previousHash}:${JSON.stringify(event)}`);
}

export function validateChain(chain: TruthTrailAuditEvent[]) {
  if (chain.length === 0) {
    return {valid: true, issues: [] as string[]};
  }

  const issues: string[] = [];

  for (let index = 0; index < chain.length; index += 1) {
    const current = chain[index];
    const previous = chain[index - 1];

    if (index === 0 && current.previousHash !== 'GENESIS') {
      issues.push('First event previousHash must be GENESIS');
    }

    if (index > 0 && current.previousHash !== previous.hash) {
      issues.push(`Broken previousHash link at index ${index}`);
    }

    const expectedHash = computeEventHash({
      eventId: current.eventId,
      eventType: current.eventType,
      actorId: current.actorId,
      delegationId: current.delegationId,
      timestamp: current.timestamp,
      action: current.action,
      payloadHash: current.payloadHash,
      correlationId: current.correlationId,
      traceId: current.traceId,
      classification: current.classification,
      previousHash: current.previousHash
    });

    if (current.hash !== expectedHash) {
      issues.push(`Invalid hash at index ${index}`);
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}
