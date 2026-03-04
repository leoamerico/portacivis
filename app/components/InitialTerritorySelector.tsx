'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import type {CircleMarker, Map as LeafletMap} from 'leaflet';

type FederativeUnit = {
  code: string;
  name: string;
  lat: number;
  lng: number;
};

type IbgeCity = {
  id: number;
  nome: string;
};

type ProspectionLayer = {
  id: string;
  label: string;
  description: string;
  source: string;
};

const FEDERATIVE_UNITS: FederativeUnit[] = [
  {code: 'AC', name: 'Acre', lat: -9.9754, lng: -67.8249},
  {code: 'AL', name: 'Alagoas', lat: -9.6498, lng: -35.7089},
  {code: 'AP', name: 'Amapá', lat: 0.0356, lng: -51.0705},
  {code: 'AM', name: 'Amazonas', lat: -3.119, lng: -60.0217},
  {code: 'BA', name: 'Bahia', lat: -12.9777, lng: -38.5016},
  {code: 'CE', name: 'Ceará', lat: -3.7319, lng: -38.5267},
  {code: 'DF', name: 'Distrito Federal', lat: -15.7939, lng: -47.8828},
  {code: 'ES', name: 'Espírito Santo', lat: -20.3155, lng: -40.3128},
  {code: 'GO', name: 'Goiás', lat: -16.6869, lng: -49.2648},
  {code: 'MA', name: 'Maranhão', lat: -2.5307, lng: -44.3068},
  {code: 'MT', name: 'Mato Grosso', lat: -15.6014, lng: -56.0979},
  {code: 'MS', name: 'Mato Grosso do Sul', lat: -20.4697, lng: -54.6201},
  {code: 'MG', name: 'Minas Gerais', lat: -19.9167, lng: -43.9345},
  {code: 'PA', name: 'Pará', lat: -1.4558, lng: -48.5044},
  {code: 'PB', name: 'Paraíba', lat: -7.1195, lng: -34.845},
  {code: 'PR', name: 'Paraná', lat: -25.4284, lng: -49.2733},
  {code: 'PE', name: 'Pernambuco', lat: -8.0476, lng: -34.877},
  {code: 'PI', name: 'Piauí', lat: -5.0919, lng: -42.8034},
  {code: 'RJ', name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729},
  {code: 'RN', name: 'Rio Grande do Norte', lat: -5.7945, lng: -35.211},
  {code: 'RS', name: 'Rio Grande do Sul', lat: -30.0346, lng: -51.2177},
  {code: 'RO', name: 'Rondônia', lat: -8.7612, lng: -63.9039},
  {code: 'RR', name: 'Roraima', lat: 2.8235, lng: -60.6753},
  {code: 'SC', name: 'Santa Catarina', lat: -27.5949, lng: -48.5482},
  {code: 'SP', name: 'São Paulo', lat: -23.5505, lng: -46.6333},
  {code: 'SE', name: 'Sergipe', lat: -10.9472, lng: -37.0731},
  {code: 'TO', name: 'Tocantins', lat: -10.184, lng: -48.3336}
];

const MARKER_BORDER_COLOR = 'var(--color-text-primary, rgb(15 23 42))';
const MARKER_FILL_COLOR = 'var(--color-brand-primary, rgb(29 78 216))';

const PROSPECTION_LAYERS: ProspectionLayer[] = [
  {
    id: 'news_signals',
    label: 'Sinais e notícias locais',
    description: 'Fatos recentes e sinais públicos para priorização comunitária.',
    source: 'Base editorial e clipping público'
  },
  {
    id: 'public_services',
    label: 'Serviços públicos',
    description: 'Leitura de oferta e acesso a serviços essenciais para a população.',
    source: 'Bases abertas municipais/estaduais'
  },
  {
    id: 'compliance',
    label: 'Conformidade e transparência',
    description: 'Indicadores de governança, controle social e obrigações públicas.',
    source: 'Portais de transparência e marcos normativos'
  },
  {
    id: 'mobility',
    label: 'Mobilidade urbana',
    description: 'Contexto de deslocamento e gargalos de mobilidade com impacto cidadão.',
    source: 'Dados públicos de mobilidade'
  },
  {
    id: 'alerts',
    label: 'Alertas prioritários',
    description: 'Ocorrências e alertas com potencial efeito imediato para o território.',
    source: 'Fontes oficiais de alerta'
  }
];

const DEFAULT_LAYERS = ['public_services', 'alerts', 'compliance'];

const STORAGE_KEY = 'portacivis_territory';

type SavedSelection = {
  uf?: string;
  city?: string;
  layers?: string[];
};

function readSaved(): SavedSelection | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedSelection) : null;
  } catch {
    return null;
  }
}

export default function InitialTerritorySelector() {
  const t = useTranslations('territory');
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, CircleMarker>>({});

  // Lazy initialisers read localStorage synchronously on first client render
  const [selectedUf, setSelectedUf] = useState<string>(() => readSaved()?.uf ?? '');
  const [city, setCity] = useState<string>('');
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityFetchFailed, setCityFetchFailed] = useState(false);
  const [selectedLayers, setSelectedLayers] = useState<string[]>(
    () => readSaved()?.layers ?? DEFAULT_LAYERS
  );
  const [hideSelectedLayerItems, setHideSelectedLayerItems] = useState(false);
  const [ctaShake, setCtaShake] = useState(false);
  const [ctaAttempted, setCtaAttempted] = useState(false);
  const [restoredCity, setRestoredCity] = useState<string | null>(null);
  const autoSelectCityRef = useRef<string | null>(null);

  // On mount: if localStorage had a city, prime autoSelectCityRef so IBGE fetch
  // picks it up and marks the selection as restored
  useEffect(() => {
    const saved = readSaved();
    if (saved?.city) {
      autoSelectCityRef.current = saved.city;
      setRestoredCity(saved.city);
    }
  }, []);

  useEffect(() => {
    let disposed = false;

    const setupMap = async () => {
      if (!mapContainerRef.current || mapRef.current) {
        return;
      }

      const L = await import('leaflet');

      if (disposed || !mapContainerRef.current) {
        return;
      }

      const map = L.map(mapContainerRef.current, {
        center: [-14.235, -51.9253],
        zoom: 4,
        minZoom: 3,
        maxZoom: 7,
        zoomControl: true
      });

      L.tileLayer('/api/map-tiles/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxNativeZoom: 19
      }).addTo(map);

      for (const uf of FEDERATIVE_UNITS) {
        const marker = L.circleMarker([uf.lat, uf.lng], {
          radius: 6,
          color: MARKER_BORDER_COLOR,
          weight: 1,
          fillColor: MARKER_FILL_COLOR,
          fillOpacity: 0.9
        })
          .addTo(map)
          .bindTooltip(`${uf.name} (${uf.code})`, {direction: 'top'});

        marker.on('click', () => {
          setSelectedUf(uf.code);
        });

        markersRef.current[uf.code] = marker;
      }

      mapRef.current = map;
    };

    void setupMap();

    return () => {
      disposed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = {};
    };
  }, []);

  useEffect(() => {
    const selected = FEDERATIVE_UNITS.find((uf) => uf.code === selectedUf);

    for (const uf of FEDERATIVE_UNITS) {
      const marker = markersRef.current[uf.code];
      if (!marker) {
        continue;
      }

      marker.setStyle(
        uf.code === selectedUf
          ? {radius: 8, fillColor: MARKER_BORDER_COLOR, color: MARKER_BORDER_COLOR}
          : {radius: 6, fillColor: MARKER_FILL_COLOR, color: MARKER_BORDER_COLOR}
      );
    }

    if (selected && mapRef.current) {
      mapRef.current.setView([selected.lat, selected.lng], 5, {
        animate: true,
        duration: 0.6
      });
    }
  }, [selectedUf]);

  useEffect(() => {
    if (!selectedUf) {
      setCityOptions([]);
      // Only clear city when UF is explicitly deselected (not on first mount restore)
      if (autoSelectCityRef.current === null) setCity('');
      setCityFetchFailed(false);
      return;
    }

    const controller = new AbortController();
    setLoadingCities(true);
    setCityFetchFailed(false);
    // Don't wipe city if autoSelectCityRef is waiting to restore it
    if (!autoSelectCityRef.current) setCity('');

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`, {
      signal: controller.signal,
      cache: 'no-store'
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('IBGE request failed');
        }
        const data = (await response.json()) as IbgeCity[];
        const options = data.map((item) => item.nome);
        setCityOptions(options);
        if (autoSelectCityRef.current) {
          const target = autoSelectCityRef.current;
          autoSelectCityRef.current = null;
          const match = options.find(
            (name) => name.toLowerCase() === target.toLowerCase()
          );
          setCity(match ?? target);
        }
      })
      .catch(() => {
        setCityOptions([]);
        setCityFetchFailed(true);
        // IBGE failed — apply target city directly into manual input and enable field
        if (autoSelectCityRef.current) {
          setCity(autoSelectCityRef.current);
          autoSelectCityRef.current = null;
        }
      })
      .finally(() => setLoadingCities(false));

    return () => controller.abort();
  }, [selectedUf]);

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
      // Focus the first unfilled field
      if (!selectedUf) {
        document.getElementById('uf-select')?.focus();
      } else if (!city.trim()) {
        document.getElementById('city-select')?.focus();
      }
      return;
    }
    persistSelection();
  };

  const persistSelection = () => {
    if (!canProceed) {
      return;
    }

    const payload = {
      uf: selectedUf,
      ufName: selectedUfName ?? selectedUf,
      city: city.trim(),
      selectedAt: new Date().toISOString(),
      correlationId,
      traceId,
      classification: 'publico',
      layers: effectiveLayers
    };

    localStorage.setItem('portacivis_territory', JSON.stringify(payload));
  };

  const fillAmparo = () => {
    autoSelectCityRef.current = 'Amparo';
    setSelectedUf('SP');
    setCtaAttempted(false);
  };

  return (
    <section className="card territory-selector" aria-labelledby="territory-selector-title">
      <h2 id="territory-selector-title">{t('title')}</h2>
      <p>{t('description')}</p>

      <div className="territory-validation-bar" role="note" aria-label="Caso de validação fixo">
        <span className="territory-validation-label">🧪 Caso de validação:</span>
        <button
          type="button"
          className="territory-validation-pill"
          onClick={fillAmparo}
          aria-label="Pré-preencher com Amparo SP para validação"
        >
          📍 Amparo — SP
        </button>
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
                  if (!layer) {
                    return null;
                  }

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
