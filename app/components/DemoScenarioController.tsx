'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { DemoScenario, DemoConfig } from '../../src/transparency/types';
import { TOUR_STEPS, getDefaultDemoConfig, buildDemoReportText } from '../../src/transparency/demo';

type Props = {
  onScenarioChange: (scenario: DemoScenario) => void;
  presentationMode: boolean;
};

export default function DemoScenarioController({ onScenarioChange, presentationMode }: Props) {
  const t = useTranslations('demoController');
  const [config, setConfig] = useState<DemoConfig>(getDefaultDemoConfig);
  const [tourActive, setTourActive] = useState(false);
  const highlightRef = useRef<HTMLDivElement>(null);

  const scenarios: { id: DemoScenario; icon: string }[] = [
    { id: 'compliant', icon: '✅' },
    { id: 'active_alerts', icon: '🚨' },
    { id: 'non_compliant', icon: '❌' },
  ];

  const handleScenarioChange = useCallback((scenario: DemoScenario) => {
    setConfig(prev => ({ ...prev, scenario }));
    onScenarioChange(scenario);
  }, [onScenarioChange]);

  const startTour = useCallback(() => {
    setTourActive(true);
    setConfig(prev => ({ ...prev, tourStep: 0 }));
  }, []);

  const nextStep = useCallback(() => {
    setConfig(prev => {
      const next = prev.tourStep + 1;
      if (next >= TOUR_STEPS.length) {
        setTourActive(false);
        return { ...prev, tourStep: 0 };
      }
      return { ...prev, tourStep: next };
    });
  }, []);

  const prevStep = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      tourStep: Math.max(0, prev.tourStep - 1),
    }));
  }, []);

  const endTour = useCallback(() => {
    setTourActive(false);
    setConfig(prev => ({ ...prev, tourStep: 0 }));
  }, []);

  // Scroll to current tour section
  useEffect(() => {
    if (!tourActive) return;
    const step = TOUR_STEPS[config.tourStep];
    if (step) {
      const el = document.getElementById(`demo-section-${step.section}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [tourActive, config.tourStep]);

  const handleExportReport = useCallback(() => {
    const text = buildDemoReportText(config.scenario);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-demo-portacivis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [config.scenario]);

  return (
    <div className={`demo-controller ${presentationMode ? 'demo-controller--presentation' : ''}`} role="region" aria-label={t('title')}>
      <div className="demo-controller-header">
        <h3>{t('title')}</h3>
        <span className="demo-controller-badge">{t('demoMode')}</span>
      </div>

      {/* Scenario toggle */}
      <div className="demo-scenarios" role="radiogroup" aria-label={t('scenarioLabel')}>
        {scenarios.map(s => (
          <button
            key={s.id}
            type="button"
            role="radio"
            className={`demo-scenario-btn ${config.scenario === s.id ? 'demo-scenario-btn--active' : ''}`}
            aria-checked={config.scenario === s.id}
            onClick={() => handleScenarioChange(s.id)}
          >
            <span aria-hidden="true">{s.icon}</span>
            {t(`scenarios.${s.id}`)}
          </button>
        ))}
      </div>

      {/* Tour controls */}
      <div className="demo-tour-controls">
        {!tourActive ? (
          <button type="button" className="demo-tour-start" onClick={startTour}>
            {t('startTour')}
          </button>
        ) : (
          <div className="demo-tour-nav">
            <span className="demo-tour-progress">
              {t('step', { current: config.tourStep + 1, total: TOUR_STEPS.length })}
            </span>
            <div className="demo-tour-step-info" ref={highlightRef}>
              <span aria-hidden="true">{TOUR_STEPS[config.tourStep]?.icon}</span>
              <span>{t(`tourSteps.${TOUR_STEPS[config.tourStep]?.id}`)}</span>
            </div>
            <div className="demo-tour-buttons">
              <button type="button" onClick={prevStep} disabled={config.tourStep === 0}>
                {t('prev')}
              </button>
              <button type="button" onClick={nextStep}>
                {config.tourStep === TOUR_STEPS.length - 1 ? t('finish') : t('next')}
              </button>
              <button type="button" onClick={endTour} className="demo-tour-end">
                {t('endTour')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Report export */}
      <button type="button" className="demo-export-report" onClick={handleExportReport}>
        {t('exportReport')}
      </button>
    </div>
  );
}
