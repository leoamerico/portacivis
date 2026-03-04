'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { DataProvenance, StalenessAlert } from '../../src/transparency/types';

type Props = {
  provenance: DataProvenance;
  stalenessAlert?: StalenessAlert;
};

export default function DataProvenanceCard({ provenance, stalenessAlert }: Props) {
  const t = useTranslations('provenanceCard');
  const [expanded, setExpanded] = useState(false);
  const hasChanges = provenance.changeHistory.length > 0;

  return (
    <div
      className={`provenance-card ${stalenessAlert ? `provenance-card--${stalenessAlert.severity}` : ''}`}
      role="region"
      aria-label={t('sourceLabel', { name: provenance.source.name })}
    >
      <button
        type="button"
        className="provenance-card-toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={`prov-details-${provenance.id}`}
      >
        <span className="provenance-card-source">
          <strong>{provenance.source.name}</strong>
          {stalenessAlert && (
            <span
              className={`provenance-stale-badge provenance-stale-badge--${stalenessAlert.severity}`}
              aria-label={t('staleLabel', { days: stalenessAlert.daysSinceUpdate })}
            >
              {stalenessAlert.severity === 'critical' ? '!!' : '!'} {t('staleDays', { days: stalenessAlert.daysSinceUpdate })}
            </span>
          )}
        </span>
        <span className="provenance-card-date">
          {t('lastUpdated')}: {new Date(provenance.lastUpdated).toLocaleDateString('pt-BR')}
        </span>
        <span className="provenance-card-chevron" aria-hidden="true">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div id={`prov-details-${provenance.id}`} className="provenance-card-details">
          <dl className="provenance-detail-list">
            <div className="provenance-detail-row">
              <dt>{t('primarySource')}</dt>
              <dd>
                <a
                  href={provenance.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="provenance-source-link"
                >
                  {provenance.source.name}
                  <span className="provenance-external-icon" aria-hidden="true"> ↗</span>
                </a>
              </dd>
            </div>
            <div className="provenance-detail-row">
              <dt>{t('capturedAt')}</dt>
              <dd>
                <time dateTime={provenance.capturedAt}>
                  {new Date(provenance.capturedAt).toLocaleString('pt-BR')}
                </time>
              </dd>
            </div>
            <div className="provenance-detail-row">
              <dt>{t('verificationHash')}</dt>
              <dd>
                <code className="provenance-hash">{provenance.contentHash}</code>
              </dd>
            </div>
          </dl>

          {hasChanges && (
            <div className="provenance-changes">
              <h4>{t('changeHistory')}</h4>
              <ul className="provenance-change-list">
                {provenance.changeHistory.map((change, idx) => (
                  <li key={idx} className="provenance-change-item">
                    <time dateTime={change.date}>
                      {new Date(change.date).toLocaleDateString('pt-BR')}
                    </time>
                    <span>{change.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stalenessAlert && (
            <div className="provenance-stale-warning" role="alert">
              <p>
                {t('staleWarning', {
                  days: stalenessAlert.daysSinceUpdate,
                  source: stalenessAlert.sourceName,
                  date: new Date(stalenessAlert.lastUpdated).toLocaleDateString('pt-BR'),
                })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
