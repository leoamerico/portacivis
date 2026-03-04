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

export default function InitialTerritorySelector() {
  const t = useTranslations('territory');
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, CircleMarker>>({});
  const [selectedUf, setSelectedUf] = useState('');
  const [city, setCity] = useState('');
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityFetchFailed, setCityFetchFailed] = useState(false);
  const [selectedLayers, setSelectedLayers] = useState<string[]>(DEFAULT_LAYERS);

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

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
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
      setCity('');
      setCityFetchFailed(false);
      return;
    }

    const controller = new AbortController();
    setLoadingCities(true);
    setCityFetchFailed(false);
    setCity('');

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`, {
      signal: controller.signal,
      cache: 'no-store'
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('IBGE request failed');
        }
        const data = (await response.json()) as IbgeCity[];
        setCityOptions(data.map((item) => item.nome));
      })
      .catch(() => {
        setCityOptions([]);
        setCityFetchFailed(true);
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

  return (
    <section className="card territory-selector" aria-labelledby="territory-selector-title">
      <h2 id="territory-selector-title">{t('title')}</h2>
      <p>{t('description')}</p>

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
            {PROSPECTION_LAYERS.map((layer) => {
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

          <Link
            href={canProceed
              ? `/trilha-da-verdade?uf=${encodeURIComponent(selectedUf)}&cidade=${encodeURIComponent(city.trim())}&correlationId=${encodeURIComponent(correlationId)}&traceId=${encodeURIComponent(traceId)}&layers=${encodeURIComponent(effectiveLayers.join(','))}`
              : '/trilha-da-verdade'
            }
            className={canProceed ? 'territory-cta' : 'territory-cta disabled'}
            onClick={persistSelection}
            aria-disabled={!canProceed}
          >
            {t('cta')}
          </Link>

          <p className="territory-summary" aria-live="polite">
            {canProceed
              ? t('summarySelected', {city: city.trim(), uf: selectedUf})
              : t('summaryPending')}
          </p>
        </div>
      </div>
    </section>
  );
}
