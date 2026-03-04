'use client';

import { useEffect, useMemo, useState } from 'react';

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

function readTextFromMain() {
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
  utterance.lang = 'pt-BR';
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<AccessibilityState>(defaultState);

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
    <aside className="accessibility-panel" aria-label="Painel de acessibilidade">
      <button
        type="button"
        className="accessibility-toggle"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-controls="accessibility-controls"
      >
        Acessibilidade
      </button>

      {open ? (
        <div id="accessibility-controls" className="accessibility-controls">
          <p className="accessibility-title">Ajustes de navegação</p>

          <div className="accessibility-row">
            <span>Tamanho do texto: {fontLabel}</span>
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
            Alto contraste
          </label>

          <label className="accessibility-row">
            <input
              type="checkbox"
              checked={state.underlineLinks}
              onChange={(event) =>
                setState((previous) => ({ ...previous, underlineLinks: event.target.checked }))
              }
            />
            Destacar links
          </label>

          <label className="accessibility-row">
            <input
              type="checkbox"
              checked={state.reducedMotion}
              onChange={(event) =>
                setState((previous) => ({ ...previous, reducedMotion: event.target.checked }))
              }
            />
            Reduzir movimento
          </label>

          <label className="accessibility-row" htmlFor="color-vision-mode">
            <span>Modo de cores</span>
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
              <option value="default">Padrão</option>
              <option value="protanopia">Daltonismo (protanopia)</option>
              <option value="deuteranopia">Daltonismo (deuteranopia)</option>
              <option value="tritanopia">Daltonismo (tritanopia)</option>
            </select>
          </label>

          <div className="accessibility-actions">
            <button type="button" onClick={readTextFromMain}>
              Ler página
            </button>
            <button type="button" onClick={() => window.speechSynthesis.cancel()}>
              Parar leitura
            </button>
            <button type="button" onClick={() => setState(defaultState)}>
              Restaurar padrão
            </button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
