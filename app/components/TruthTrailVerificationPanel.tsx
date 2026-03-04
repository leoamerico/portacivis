'use client';

import {useEffect, useMemo, useState} from 'react';

type VerificationResponse = {
  success: boolean;
  chainLength: number;
  head: string;
  issues: string[];
};

type Labels = {
  loading: string;
  status: string;
  healthy: string;
  broken: string;
  chainLength: string;
  headHash: string;
  issuesTitle: string;
  noIssues: string;
  refresh: string;
  requestError: string;
};

const EMPTY_RESPONSE: VerificationResponse = {
  success: false,
  chainLength: 0,
  head: 'GENESIS',
  issues: []
};

export default function TruthTrailVerificationPanel({labels}: {labels: Labels}) {
  const [data, setData] = useState<VerificationResponse>(EMPTY_RESPONSE);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState<string>('');

  const statusText = useMemo(
    () => (data.success ? labels.healthy : labels.broken),
    [data.success, labels.healthy, labels.broken]
  );

  async function loadVerification() {
    setLoading(true);
    setRequestError('');

    try {
      const response = await fetch('/api/truth-trail/verify', {
        method: 'GET',
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = (await response.json()) as VerificationResponse;
      setData({
        success: Boolean(result.success),
        chainLength: Number(result.chainLength) || 0,
        head: result.head || 'GENESIS',
        issues: Array.isArray(result.issues) ? result.issues : []
      });
    } catch {
      setRequestError(labels.requestError);
      setData(EMPTY_RESPONSE);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadVerification();
  }, []);

  return (
    <section className="card" aria-live="polite" aria-busy={loading}>
      {loading ? (
        <p>{labels.loading}</p>
      ) : (
        <>
          <ul>
            <li>{labels.status}: {statusText}</li>
            <li>{labels.chainLength}: {data.chainLength}</li>
            <li>{labels.headHash}: {data.head}</li>
          </ul>

          <h2>{labels.issuesTitle}</h2>
          {requestError ? (
            <p>{requestError}</p>
          ) : data.issues.length === 0 ? (
            <p>{labels.noIssues}</p>
          ) : (
            <ul>
              {data.issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          )}

          <button type="button" className="secondary-button" onClick={() => void loadVerification()}>
            {labels.refresh}
          </button>
        </>
      )}
    </section>
  );
}