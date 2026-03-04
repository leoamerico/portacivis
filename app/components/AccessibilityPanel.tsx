'use client';

import { useEffect, useMemo, useState } from 'react';
import {useLocale, useTranslations} from 'next-intl';

type AccessibilityState = {
  fontScale: number;
  highContrast: boolean;
  underlineLinks: boolean;
  reducedMotion: boolean;
  colorVisionMode: 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia';
};

const defaultState: AccessibilityState = {
  fontScale: 100,
  highContrast: false,
  underlineLinks: false,
  reducedMotion: false,
  colorVisionMode: 'default',
};

const storageKey = 'portacivis.accessibility.preferences';

function applyAccessibility(state: AccessibilityState) {
  const body = document.body;
  body.style.setProperty('--font-scale', String(state.fontScale));
  body.setAttribute('data-contrast', state.highContrast ? 'high' : 'normal');
  body.setAttribute('data-underline-links', state.underlineLinks ? 'true' : 'false');
  body.setAttribute('data-reduced-motion', state.reducedMotion ? 'true' : 'false');
  body.setAttribute('data-color-vision', state.colorVisionMode);
}

function readTextFromMain(locale: string) {
  const main = document.getElementById('conteudo-principal');
  if (!main) {
    return;
  }

  const content = main.textContent?.trim();
  if (!content) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(content);
  utterance.lang = locale;
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<AccessibilityState>(defaultState);
  const locale = useLocale();
  const t = useTranslations('accessibilityPanel');

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      applyAccessibility(defaultState);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as AccessibilityState;
      setState(parsed);
      applyAccessibility(parsed);
    } catch {
      applyAccessibility(defaultState);
    }
  }, []);

  useEffect(() => {
    applyAccessibility(state);
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const fontLabel = useMemo(() => `${state.fontScale}%`, [state.fontScale]);

  return (
    <aside className="accessibility-panel" aria-label={t('aria')}>
      <button
        type="button"
        className="accessibility-toggle"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-controls="accessibility-controls"
      >
        {t('toggle')}
      </button>

      {open ? (
        <div id="accessibility-controls" className="accessibility-controls">
          <p className="accessibility-title">{t('title')}</p>

          <div className="accessibility-row">
            <span>{t('fontSize')}: {fontLabel}</span>
            <div className="accessibility-inline-buttons">
              <button
                type="button"
                onClick={() =>
                  setState((previous) => ({
                    ...previous,
                    fontScale: Math.max(90, previous.fontScale - 10),
                  }))
                }
              >
                A-
              </button>
              <button
                type="button"
                onClick={() =>
                  setState((previous) => ({
                    ...previous,
                    fontScale: Math.min(150, previous.fontScale + 10),
                  }))
                }
              >
                A+
              </button>
            </div>
          </div>

          <label className="accessibility-row">
            <input
              type="checkbox"
              checked={state.highContrast}
              onChange={(event) =>
                setState((previous) => ({ ...previous, highContrast: event.target.checked }))
              }
            />
            {t('highContrast')}
          </label>

          <label className="accessibility-row">
            <input
              type="checkbox"
              checked={state.underlineLinks}
              onChange={(event) =>
                setState((previous) => ({ ...previous, underlineLinks: event.target.checked }))
              }
            />
            {t('underlineLinks')}
          </label>

          <label className="accessibility-row">
            <input
              type="checkbox"
              checked={state.reducedMotion}
              onChange={(event) =>
                setState((previous) => ({ ...previous, reducedMotion: event.target.checked }))
              }
            />
            {t('reduceMotion')}
          </label>

          <label className="accessibility-row" htmlFor="color-vision-mode">
            <span>{t('colorMode')}</span>
            <select
              id="color-vision-mode"
              value={state.colorVisionMode}
              onChange={(event) =>
                setState((previous) => ({
                  ...previous,
                  colorVisionMode: event.target.value as AccessibilityState['colorVisionMode'],
                }))
              }
            >
              <option value="default">{t('default')}</option>
              <option value="protanopia">{t('protanopia')}</option>
              <option value="deuteranopia">{t('deuteranopia')}</option>
              <option value="tritanopia">{t('tritanopia')}</option>
            </select>
          </label>

          <div className="accessibility-actions">
            <button type="button" onClick={() => readTextFromMain(locale)}>
              {t('readPage')}
            </button>
            <button type="button" onClick={() => window.speechSynthesis.cancel()}>
              {t('stopReading')}
            </button>
            <button type="button" onClick={() => setState(defaultState)}>
              {t('restore')}
            </button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
