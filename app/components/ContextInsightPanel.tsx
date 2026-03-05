'use client';

import {useEffect, useMemo, useState} from 'react';

type PhaseAResponse = {
  traceId: string;
  phase: 'A';
  summary: string;
  highlights: string[];
  recommendedActions: string[];
  confidence: number;
  expiresAt: string;
};

type StatusResponse = {
  traceId: string;
  phaseA: 'ready';
  phaseB: 'running' | 'ready' | 'failed' | 'cancelled';
  progress: number;
  agents: Record<string, 'queued' | 'running' | 'done' | 'failed'>;
};

type PhaseBResponse = {
  traceId: string;
  phase: 'B';
  panorama: {
    services: string[];
    alerts: string[];
    compliance: string[];
    mobility: string[];
  };
  evidence: Array<{title: string; url: string; collectedAt: string}>;
  nextActs: string[];
  warnings?: string[];
};

type Props = {
  uf: string;
  cidade: string;
  traceId: string;
  correlationId: string;
  layers?: string[];
};

const DEFAULT_LAYERS = ['public_services', 'alerts', 'compliance'];

export default function ContextInsightPanel({uf, cidade, traceId, correlationId, layers}: Props) {
  const [phaseA, setPhaseA] = useState<PhaseAResponse | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [phaseB, setPhaseB] = useState<PhaseBResponse | null>(null);
  const [error, setError] = useState('');

  const activeLayers = useMemo(
    () => (layers && layers.length > 0 ? layers : DEFAULT_LAYERS),
    [layers]
  );

  const cityCode = useMemo(() => {
    if (correlationId.trim().length > 0) {
      return correlationId;
    }

    const normalized = `${uf}-${cidade}`.toLowerCase().replace(/\s+/g, '-');
    return normalized || 'context-city';
  }, [correlationId, uf, cidade]);

  useEffect(() => {
    if (!uf || !cidade || !traceId) {
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const selectContext = async () => {
      try {
        const response = await fetch('/api/context/select', {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({
            traceId,
            locale: 'pt-BR',
            context: {
              country: 'BR',
              state: uf,
              city: cidade,
              cityCode,
              source: 'trilha_da_verdade'
            },
            layers: activeLayers,
            source: 'trilha_da_verdade'
          })
        });

        if (!response.ok) {
          throw new Error('context select failed');
        }

        const payload = (await response.json()) as PhaseAResponse;
        if (!cancelled) {
          setPhaseA(payload);
        }
      } catch {
        if (!cancelled) {
          setError('Não foi possível carregar as informações da sua cidade agora.');
        }
      }
    };

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/context/status?traceId=${encodeURIComponent(traceId)}`, {
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error('status failed');
        }

        const payload = (await response.json()) as StatusResponse;

        if (cancelled) {
          return;
        }

        setStatus(payload);

        if (payload.phaseB === 'ready') {
          const resultResponse = await fetch(`/api/context/result?traceId=${encodeURIComponent(traceId)}`, {
            cache: 'no-store'
          });

          if (!resultResponse.ok) {
            throw new Error('result failed');
          }

          const result = (await resultResponse.json()) as PhaseBResponse;
          if (!cancelled) {
            setPhaseB(result);
          }
          return;
        }

        if (payload.phaseB === 'running') {
          timer = setTimeout(() => {
            void pollStatus();
          }, 1500);
        }
      } catch {
        if (!cancelled) {
          setError('Não foi possível completar a análise detalhada.');
        }
      }
    };

    void selectContext().then(() => {
      void pollStatus();
    });

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [uf, cidade, traceId, cityCode, activeLayers]);

  if (!uf || !cidade || !traceId) {
    return null;
  }

  return (
    <section className="card" aria-live="polite">
      <h2>Panorama da Cidade</h2>
      <p>Informações sobre {cidade}/{uf}.</p>

      {error && <p>{error}</p>}

      {!error && !phaseA && <p>Carregando informações...</p>}

      {phaseA && (
        <>
          <h3>Resumo inicial</h3>
          <p>{phaseA.summary}</p>
          <ul>
            {phaseA.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </>
      )}

      {status && (
        <>
          <h3>Análise detalhada</h3>
          <p>Progresso: {status.progress}%</p>
        </>
      )}

      {phaseB && (
        <>
          <h3>Próximos passos</h3>
          <ul>
            {phaseB.nextActs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {phaseB.warnings?.length ? (
            <p>{phaseB.warnings.join(' ')}</p>
          ) : null}
        </>
      )}
    </section>
  );
}
