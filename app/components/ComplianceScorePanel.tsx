'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { ComplianceScore, LAIRequest } from '../../src/transparency/types';
import { getColorGradeHex, generateLAIRequest, getDemoComplianceScores } from '../../src/transparency/compliance';

export default function ComplianceScorePanel() {
  const t = useTranslations('complianceScore');
  const allScores = useMemo(() => getDemoComplianceScores(), []);
  const [selectedCities, setSelectedCities] = useState<string[]>([allScores[0]?.cityCode ?? '']);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [laiRequest, setLaiRequest] = useState<LAIRequest | null>(null);
  const [copiedLai, setCopiedLai] = useState(false);

  const toggleCity = (code: string) => {
    setSelectedCities(prev => {
      if (prev.includes(code)) return prev.filter(c => c !== code);
      if (prev.length >= 5) return prev;
      return [...prev, code];
    });
  };

  const selectedScores = useMemo(
    () => allScores.filter(s => selectedCities.includes(s.cityCode)),
    [allScores, selectedCities]
  );

  const handleCobrar = (score: ComplianceScore) => {
    const req = generateLAIRequest(score);
    setLaiRequest(req);
  };

  const handleCopyLai = async () => {
    if (!laiRequest) return;
    try {
      await navigator.clipboard.writeText(laiRequest.templateText);
      setCopiedLai(true);
      setTimeout(() => setCopiedLai(false), 2000);
    } catch { /* fallback */ }
  };

  return (
    <div className="compliance-panel" role="region" aria-label={t('title')}>
      <h2 className="compliance-panel-title">{t('title')}</h2>
      <p className="compliance-panel-desc">{t('description')}</p>

      {/* City selector */}
      <fieldset className="compliance-city-selector" aria-label={t('selectCities')}>
        <legend>{t('selectCities')} ({t('maxCities')})</legend>
        <div className="compliance-city-chips">
          {allScores.map(score => (
            <label key={score.cityCode} className="compliance-city-chip">
              <input
                type="checkbox"
                checked={selectedCities.includes(score.cityCode)}
                onChange={() => toggleCity(score.cityCode)}
                disabled={!selectedCities.includes(score.cityCode) && selectedCities.length >= 5}
              />
              <span
                className="compliance-city-chip-label"
                style={{ borderColor: getColorGradeHex(score.colorGrade) }}
              >
                {score.cityName} — {score.uf}
                <span
                  className={`compliance-score-dot compliance-score-dot--${score.colorGrade}`}
                  aria-label={`Score: ${score.overallScore}`}
                />
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Score cards */}
      <div className="compliance-scores-grid">
        {selectedScores.map(score => (
          <article
            key={score.cityCode}
            className={`compliance-score-card compliance-score-card--${score.colorGrade}`}
            aria-label={`${score.cityName}: ${score.overallScore}/100`}
          >
            <div className="compliance-score-header">
              <div className="compliance-score-ring" style={{ '--score-color': getColorGradeHex(score.colorGrade) } as React.CSSProperties}>
                <span className="compliance-score-value">{score.overallScore}</span>
                <span className="compliance-score-max">/100</span>
              </div>
              <div className="compliance-score-city-info">
                <h3>{score.cityName}</h3>
                <span>{score.uf}</span>
              </div>
            </div>

            <button
              type="button"
              className="compliance-score-expand"
              onClick={() => setExpandedCity(expandedCity === score.cityCode ? null : score.cityCode)}
              aria-expanded={expandedCity === score.cityCode}
            >
              {expandedCity === score.cityCode ? t('collapse') : t('expand')}
            </button>

            {expandedCity === score.cityCode && (
              <div className="compliance-score-details">
                <h4>{t('dimensions')}</h4>
                <ul className="compliance-dimension-list">
                  {score.dimensions.map(dim => (
                    <li key={dim.id} className={`compliance-dimension compliance-dimension--${dim.status}`}>
                      <span className="compliance-dimension-name">{dim.name}</span>
                      <div className="compliance-dimension-bar-wrap">
                        <div
                          className="compliance-dimension-bar"
                          style={{ width: `${(dim.score / dim.maxScore) * 100}%` }}
                          role="progressbar"
                          aria-valuenow={dim.score}
                          aria-valuemax={dim.maxScore}
                          aria-label={`${dim.name}: ${dim.score}/${dim.maxScore}`}
                        />
                      </div>
                      <span className="compliance-dimension-score">{dim.score}/{dim.maxScore}</span>
                    </li>
                  ))}
                </ul>

                {/* History timeline */}
                {score.history.length > 0 && (
                  <div className="compliance-history">
                    <h4>{t('history')}</h4>
                    <div className="compliance-history-chart" role="img" aria-label={t('historyChart')}>
                      {score.history.map((entry, idx) => (
                        <div
                          key={idx}
                          className="compliance-history-bar"
                          style={{
                            height: `${entry.score}%`,
                            backgroundColor: getColorGradeHex(entry.colorGrade),
                          }}
                          title={`${entry.date}: ${entry.score}/100`}
                          aria-label={`${entry.date}: ${entry.score}/100`}
                        >
                          <span className="compliance-history-label">{entry.score}</span>
                        </div>
                      ))}
                    </div>
                    <div className="compliance-history-dates">
                      {score.history.filter((_, i) => i % 3 === 0).map((entry, idx) => (
                        <span key={idx}>{entry.date}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* "Cobrar" button */}
                {score.overallScore < 50 && (
                  <button
                    type="button"
                    className="compliance-cobrar-btn"
                    onClick={() => handleCobrar(score)}
                  >
                    {t('cobrarBtn')}
                  </button>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* LAI Request Modal */}
      {laiRequest && (
        <div className="compliance-lai-overlay" role="dialog" aria-label={t('laiTitle')}>
          <div className="compliance-lai-modal">
            <h3>{t('laiTitle')}</h3>
            <p>{t('laiDescription', { city: laiRequest.cityName })}</p>
            <pre className="compliance-lai-template">{laiRequest.templateText}</pre>
            <div className="compliance-lai-actions">
              <button type="button" onClick={handleCopyLai} className="compliance-lai-copy">
                {copiedLai ? t('laiCopied') : t('laiCopy')}
              </button>
              <a
                href={`mailto:${laiRequest.ouvidoriaEmail}?subject=Pedido LAI — ${laiRequest.cityName}&body=${encodeURIComponent(laiRequest.templateText)}`}
                className="compliance-lai-email"
              >
                {t('laiSendEmail')}
              </a>
              <button type="button" onClick={() => setLaiRequest(null)} className="compliance-lai-close">
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
