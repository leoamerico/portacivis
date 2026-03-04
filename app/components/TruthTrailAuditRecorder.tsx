'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';

type TrailAuditEvent = {
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

type Props = {
  uf: string;
  cidade: string;
  correlationId: string;
  traceId: string;
  classification: string;
};

const CHAIN_STORAGE_KEY = 'portacivis_audit_chain';

function randomId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}`;
}

async function sha256Hex(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function postToServer(
  event: Omit<TrailAuditEvent, 'hash'>
): Promise<{success: true; deduplicated: boolean; hash: string}> {
  const response = await fetch('/api/truth-trail/audit', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(event)
  });

  if (!response.ok) {
    throw new Error('server audit failed');
  }

  const payload = (await response.json()) as {
    success: boolean;
    deduplicated?: boolean;
    hash?: string;
  };

  if (!payload.success || !payload.hash) {
    throw new Error('server audit invalid response');
  }

  return {
    success: true,
    deduplicated: Boolean(payload.deduplicated),
    hash: payload.hash
  };
}

function safeParseChain(raw: string | null): TrailAuditEvent[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as TrailAuditEvent[];
  } catch {
    return [];
  }
}

export default function TruthTrailAuditRecorder({
  uf,
  cidade,
  correlationId,
  traceId,
  classification
}: Props) {
  const t = useTranslations('truthTrail');
  const [status, setStatus] = useState<'idle' | 'recorded' | 'exists' | 'error'>('idle');
  const [lastHash, setLastHash] = useState('');

  useEffect(() => {
    if (!uf || !cidade || !correlationId || !traceId) {
      setStatus('error');
      return;
    }

    const run = async () => {
      try {
        const chain = safeParseChain(localStorage.getItem(CHAIN_STORAGE_KEY));

        const alreadyExists = chain.some(
          (event) =>
            event.eventType === 'TruthTrailEntered' &&
            event.correlationId === correlationId &&
            event.traceId === traceId
        );

        if (alreadyExists) {
          const latest = chain[chain.length - 1];
          setLastHash(latest?.hash ?? '');
          setStatus('exists');
          return;
        }

        const payload = JSON.stringify({uf, cidade});
        const payloadHash = await sha256Hex(payload);
        const previousHash = chain.length > 0 ? chain[chain.length - 1].hash : 'GENESIS';

        const unsignedEvent = {
          eventId: randomId('evt'),
          eventType: 'TruthTrailEntered',
          actorId: 'visitor-anonymous',
          delegationId: 'none',
          timestamp: new Date().toISOString(),
          action: 'enter_truth_trail',
          payloadHash,
          correlationId,
          traceId,
          classification,
          previousHash
        };

        try {
          const server = await postToServer(unsignedEvent);
          setLastHash(server.hash);
          setStatus(server.deduplicated ? 'exists' : 'recorded');
          return;
        } catch {
          const hash = await sha256Hex(`${previousHash}:${JSON.stringify(unsignedEvent)}`);
          const fullEvent: TrailAuditEvent = {
            ...unsignedEvent,
            hash
          };

          const nextChain = [...chain, fullEvent];
          localStorage.setItem(CHAIN_STORAGE_KEY, JSON.stringify(nextChain));
          setLastHash(hash);
        }

        setStatus('recorded');
      } catch {
        setStatus('error');
      }
    };

    void run();
  }, [uf, cidade, correlationId, traceId, classification]);

  return (
    <section className="card" aria-live="polite">
      <h2>{t('auditTitle')}</h2>
      <p>{t('auditServerPreferred')}</p>
      {status === 'recorded' && <p>{t('auditRecorded')}</p>}
      {status === 'exists' && <p>{t('auditExists')}</p>}
      {status === 'error' && <p>{t('auditError')}</p>}
      {lastHash && <p>{t('auditHash', {hash: `${lastHash.slice(0, 16)}...`})}</p>}
    </section>
  );
}
