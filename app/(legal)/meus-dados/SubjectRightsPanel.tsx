'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';

type RightType =
  | 'access'
  | 'rectify'
  | 'anonymize'
  | 'portability'
  | 'delete'
  | 'consent'
  | 'oppose';

type SubjectRequestSummary = {
  id: string;
  date: string;
  rightType: RightType;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  deadline: string;
  responseDate?: string;
  dpoNotified: boolean;
};

type RightCardLabels = {
  title: string;
  description: string;
  button: string;
  article: string;
};

type Labels = {
  rightsTitle: string;
  rightsDescription: string;
  rights: Record<RightType, RightCardLabels>;
  submitSuccess: string;
  submitError: string;
  requestId: string;
  deadline: string;
  statusPending: string;
  statusInProgress: string;
  statusCompleted: string;
  statusRejected: string;
  dpoNotified: string;
  requestsTitle: string;
  noRequests: string;
  loadingRequests: string;
  requestsError: string;
  refreshRequests: string;
  legalNotice: string;
  dpoContact: string;
  sessionLabel: string;
  sessionHint: string;
};

const RIGHT_TYPES: RightType[] = [
  'access',
  'rectify',
  'anonymize',
  'portability',
  'delete',
  'consent',
  'oppose'
];

function getOrCreateSessionId(): string {
  const key = 'portacivis_lgpd_session';
  try {
    const existing = sessionStorage.getItem(key);
    if (existing && existing.length >= 16) return existing;
    const id = `sess-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(key, id);
    return id;
  } catch {
    return `sess-${Date.now().toString(36)}`;
  }
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return isoString;
  }
}

export default function SubjectRightsPanel({labels}: {labels: Labels}) {
  const [sessionId, setSessionId] = useState<string>('');
  const [submitting, setSubmitting] = useState<RightType | null>(null);
  const [lastResult, setLastResult] = useState<{type: 'success' | 'error'; message: string; requestId?: string} | null>(null);
  const [requests, setRequests] = useState<SubjectRequestSummary[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState('');

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  const loadRequests = useCallback(async () => {
    if (!sessionId) return;
    setLoadingRequests(true);
    setRequestsError('');
    try {
      const res = await fetch('/api/lgpd/subject-rights', {
        method: 'GET',
        headers: {'x-session-id': sessionId},
        cache: 'no-store'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as {success: boolean; requests?: SubjectRequestSummary[]};
      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch {
      setRequestsError(labels.requestsError);
    } finally {
      setLoadingRequests(false);
    }
  }, [sessionId, labels.requestsError]);

  useEffect(() => {
    if (sessionId) void loadRequests();
  }, [sessionId, loadRequests]);

  async function handleRequest(rightType: RightType) {
    if (!sessionId || submitting) return;
    setSubmitting(rightType);
    setLastResult(null);
    try {
      const res = await fetch('/api/lgpd/subject-rights', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: rightType, sessionId})
      });
      const data = (await res.json()) as {
        success: boolean;
        request?: {id: string};
        error?: string;
      };
      if (res.ok && data.success) {
        setLastResult({
          type: 'success',
          message: labels.submitSuccess,
          requestId: data.request?.id
        });
        void loadRequests();
      } else {
        setLastResult({type: 'error', message: labels.submitError});
      }
    } catch {
      setLastResult({type: 'error', message: labels.submitError});
    } finally {
      setSubmitting(null);
    }
  }

  function statusLabel(status: SubjectRequestSummary['status']): string {
    switch (status) {
      case 'pending': return labels.statusPending;
      case 'in_progress': return labels.statusInProgress;
      case 'completed': return labels.statusCompleted;
      case 'rejected': return labels.statusRejected;
      default: return status;
    }
  }

  const rightAccents: Record<RightType, string> = useMemo(() => ({
    access: 'blue',
    rectify: 'teal',
    anonymize: 'violet',
    portability: 'orange',
    delete: 'red',
    consent: 'amber',
    oppose: 'slate'
  }), []);

  return (
    <div>
      <section className="card" aria-label={labels.sessionLabel}>
        <p><strong>{labels.sessionLabel}:</strong> {sessionId || '…'}</p>
        <p className="muted-text">{labels.sessionHint}</p>
      </section>

      <section aria-labelledby="rights-heading">
        <h2 id="rights-heading">{labels.rightsTitle}</h2>
        <p>{labels.rightsDescription}</p>

        <div className="two-col-grid">
          {RIGHT_TYPES.map((rightType) => {
            const right = labels.rights[rightType];
            return (
              <article
                key={rightType}
                className="card card-accented"
                data-accent={rightAccents[rightType]}
                aria-labelledby={`right-${rightType}`}
              >
                <h3 id={`right-${rightType}`}>{right.title}</h3>
                <p className="muted-text">{right.article}</p>
                <p>{right.description}</p>
                <button
                  type="button"
                  className="section-card-cta"
                  disabled={submitting === rightType || !sessionId}
                  onClick={() => void handleRequest(rightType)}
                  aria-busy={submitting === rightType}
                >
                  {submitting === rightType ? '…' : right.button}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {lastResult && (
        <div
          role="status"
          aria-live="polite"
          className={`card ${lastResult.type === 'success' ? 'card-accented' : ''}`}
          data-accent={lastResult.type === 'success' ? 'teal' : undefined}
        >
          <p>{lastResult.message}</p>
          {lastResult.requestId && (
            <p><strong>{labels.requestId}:</strong> {lastResult.requestId}</p>
          )}
        </div>
      )}

      <section aria-labelledby="requests-heading" className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 id="requests-heading">{labels.requestsTitle}</h2>
          <button
            type="button"
            className="secondary-button"
            onClick={() => void loadRequests()}
            disabled={loadingRequests}
          >
            {labels.refreshRequests}
          </button>
        </div>

        {loadingRequests ? (
          <p aria-live="polite">{labels.loadingRequests}</p>
        ) : requestsError ? (
          <p role="alert">{requestsError}</p>
        ) : requests.length === 0 ? (
          <p>{labels.noRequests}</p>
        ) : (
          <ul className="styled-list" aria-label={labels.requestsTitle}>
            {requests.map((r) => (
              <li key={r.id}>
                <strong>{r.id}</strong> — {labels.rights[r.rightType]?.title ?? r.rightType}
                {' · '}
                {statusLabel(r.status)}
                {' · '}
                {labels.deadline}: {formatDate(r.deadline)}
                {r.dpoNotified && ` · ${labels.dpoNotified}`}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card" aria-label="Aviso legal LGPD">
        <p className="muted-text">{labels.legalNotice}</p>
        <p className="muted-text">{labels.dpoContact}</p>
      </section>
    </div>
  );
}
