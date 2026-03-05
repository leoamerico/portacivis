'use client';

import {useMemo, useState} from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {FEDERATIVE_UNITS, PROSPECTION_LAYERS, DEFAULT_LAYERS} from '../../src/territory/constants';
import {readSavedSelection, persistSelection} from '../../src/territory/persistence';
import {useTerritoryMap} from '../hooks/useTerritoryMap';
import {useCitiesLoader} from '../hooks/useCitiesLoader';
import {useCityMarker} from '../hooks/useCityMarker';

export default function InitialTerritorySelector() {
  const t = useTranslations('territory');

  const [selectedUf, setSelectedUf] = useState<string>(() => readSavedSelection()?.uf ?? '');
  const [selectedLayers, setSelectedLayers] = useState<string[]>(
    () => readSavedSelection()?.layers ?? DEFAULT_LAYERS
  );
  const [hideSelectedLayerItems, setHideSelectedLayerItems] = useState(false);
  const [ctaShake, setCtaShake] = useState(false);
  const [ctaAttempted, setCtaAttempted] = useState(false);

  const {mapContainerRef, mapRef} = useTerritoryMap(selectedUf, setSelectedUf);
  const {city, setCity, cityOptions, loadingCities, cityFetchFailed, setAutoSelectCity} =
    useCitiesLoader(selectedUf);
  useCityMarker(city, selectedUf, mapRef);

  const selectedUfName = useMemo(
    () => FEDERATIVE_UNITS.find((uf) => uf.code === selectedUf)?.name,
    [selectedUf]
  );

  const canProceed = selectedUf.trim().length > 0 && city.trim().length > 0;
  const effectiveLayers = selectedLayers.length > 0 ? selectedLayers : DEFAULT_LAYERS;
  const visibleLayers = hideSelectedLayerItems
    ? PROSPECTION_LAYERS.filter((layer) => !effectiveLayers.includes(layer.id))
    : PROSPECTION_LAYERS;

  const correlationId = useMemo(() => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `cid-${Date.now()}`;
  }, []);

  const traceId = useMemo(() => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `tid-${Date.now()}`;
  }, []);

  const handleCtaClick = (e: React.MouseEvent) => {
    if (!canProceed) {
      e.preventDefault();
      setCtaAttempted(true);
      setCtaShake(true);
      setTimeout(() => setCtaShake(false), 600);
      if (!selectedUf) {
        document.getElementById('uf-select')?.focus();
      } else if (!city.trim()) {
        document.getElementById('city-select')?.focus();
      }
      return;
    }
    persistSelection({
      uf: selectedUf,
      ufName: selectedUfName ?? selectedUf,
      city: city.trim(),
      selectedAt: new Date().toISOString(),
      correlationId,
      traceId,
      classification: 'publico',
      layers: effectiveLayers
    });
  };

  const fillAmparo = () => {
    setAutoSelectCity('Amparo');
    setSelectedUf('SP');
    setCtaAttempted(false);
  };

  const fillAurora = () => {
    setAutoSelectCity('Cidade Aurora');
    setSelectedUf('MG');
    setCtaAttempted(false);
  };

  return (
    <section className="card territory-selector" aria-labelledby="territory-selector-title">
      <h2 id="territory-selector-title">{t('title')}</h2>
      <p>{t('description')}</p>

      <div className="territory-validation-bar" role="note" aria-label="Casos demonstrativos disponíveis">
        <span className="territory-validation-label">🧪 Demo:</span>
        <button
          type="button"
          className="territory-validation-pill"
          onClick={fillAmparo}
          aria-label="Pré-preencher com Amparo SP para validação"
        >
          📍 Amparo — SP
        </button>
        <button
          type="button"
          className="territory-validation-pill territory-validation-pill--aurora"
          onClick={fillAurora}
          aria-label="Carregar Cidade Aurora — ambiente Smart City demonstrativo"
        >
          🌆 Cidade Aurora — MG
        </button>
        <a
          href="/cidade-aurora"
          className="territory-validation-pill territory-validation-pill--link"
          aria-label="Ver painel completo de Cidade Aurora"
        >
          Ver painel →
        </a>
      </div>

      <div className="territory-layout">
        <div className="territory-map-wrap" aria-label={t('mapAria')}>
          <h3 className="territory-map-title">{t('mapTitle')}</h3>
          <p className="territory-map-description">{t('mapDescription')}</p>
          <div ref={mapContainerRef} className="territory-map-canvas" role="img" aria-label={t('mapAria')} />
        </div>

        <div className="territory-controls">
          <label htmlFor="uf-select">{t('fields.uf')}</label>
          <select
            id="uf-select"
            value={selectedUf}
            onChange={(event) => setSelectedUf(event.target.value)}
          >
            <option value="">{t('fields.ufPlaceholder')}</option>
            {FEDERATIVE_UNITS.map((uf) => (
              <option key={uf.code} value={uf.code}>
                {uf.name} ({uf.code})
              </option>
            ))}
          </select>

          <label htmlFor="city-select">{t('fields.city')}</label>
          {loadingCities ? (
            <p className="territory-loading">{t('fields.cityLoading')}</p>
          ) : cityOptions.length > 0 ? (
            <select
              id="city-select"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              disabled={!selectedUf}
            >
              <option value="">{t('fields.cityPlaceholder')}</option>
              {cityOptions.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="city-select"
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder={t('fields.cityManualPlaceholder')}
              disabled={!selectedUf}
            />
          )}

          {cityFetchFailed && <p className="territory-hint">{t('fields.cityManualHint')}</p>}

          <fieldset className="territory-layers" aria-label="Camadas de contexto para prospecção cidadã">
            <legend>Camadas para análise populacional</legend>

            <label className="territory-hide-selected-toggle">
              <input
                type="checkbox"
                checked={hideSelectedLayerItems}
                onChange={(event) => setHideSelectedLayerItems(event.target.checked)}
              />
              <span>Ocultar itens selecionados</span>
            </label>

            {effectiveLayers.length > 0 ? (
              <div className="territory-selected-chips" aria-label="Camadas selecionadas">
                {effectiveLayers.map((layerId) => {
                  const layer = PROSPECTION_LAYERS.find((item) => item.id === layerId);
                  if (!layer) return null;

                  return (
                    <button
                      key={layer.id}
                      type="button"
                      className="territory-layer-chip"
                      onClick={() => {
                        setSelectedLayers((current) => current.filter((item) => item !== layer.id));
                      }}
                    >
                      {layer.label} ×
                    </button>
                  );
                })}
              </div>
            ) : null}

            {visibleLayers.map((layer) => {
              const checked = effectiveLayers.includes(layer.id);
              return (
                <label key={layer.id} className="territory-layer-option">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => {
                      setSelectedLayers((current) => {
                        if (event.target.checked) {
                          return current.includes(layer.id) ? current : [...current, layer.id];
                        }
                        return current.filter((item) => item !== layer.id);
                      });
                    }}
                  />
                  <span>
                    <strong>{layer.label}</strong>
                    <small>{layer.description} • Fonte: {layer.source}</small>
                  </span>
                </label>
              );
            })}
          </fieldset>

          <div className="territory-cta-wrap">
            <Link
              href={canProceed
                ? `/trilha-da-verdade?uf=${encodeURIComponent(selectedUf)}&cidade=${encodeURIComponent(city.trim())}&correlationId=${encodeURIComponent(correlationId)}&traceId=${encodeURIComponent(traceId)}&layers=${encodeURIComponent(effectiveLayers.join(','))}`
                : '#'
              }
              className={[
                'territory-cta',
                canProceed ? 'territory-cta--ready' : 'territory-cta--locked',
                ctaShake ? 'territory-cta--shake' : ''
              ].filter(Boolean).join(' ')}
              onClick={handleCtaClick}
              aria-disabled={!canProceed}
              aria-label={canProceed
                ? `Iniciar trilha da verdade para ${city.trim()} - ${selectedUf}`
                : 'Preencha estado e cidade para iniciar a trilha da verdade'
              }
            >
              <span className="territory-cta-icon" aria-hidden="true">
                {canProceed ? '▶' : '○'}
              </span>
              <span className="territory-cta-label">{t('cta')}</span>
              {canProceed && <span className="territory-cta-arrow" aria-hidden="true">→</span>}
            </Link>

            <p className="territory-cta-hint" aria-live="polite" role="status">
              {canProceed
                ? `✓ ${city.trim()} — ${selectedUf} selecionado. Clique para iniciar.`
                : !selectedUf
                  ? ctaAttempted ? '⚠ Selecione o estado para continuar.' : 'Selecione o estado e a cidade para iniciar.'
                  : ctaAttempted ? '⚠ Digite a cidade para continuar.' : 'Agora selecione a cidade.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
