'use client';

import {useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';

type FederativeUnit = {
  code: string;
  name: string;
  x: number;
  y: number;
};

type IbgeCity = {
  id: number;
  nome: string;
};

const FEDERATIVE_UNITS: FederativeUnit[] = [
  {code: 'AC', name: 'Acre', x: 88, y: 250},
  {code: 'AL', name: 'Alagoas', x: 420, y: 242},
  {code: 'AP', name: 'Amapá', x: 284, y: 60},
  {code: 'AM', name: 'Amazonas', x: 170, y: 140},
  {code: 'BA', name: 'Bahia', x: 370, y: 236},
  {code: 'CE', name: 'Ceará', x: 410, y: 170},
  {code: 'DF', name: 'Distrito Federal', x: 312, y: 230},
  {code: 'ES', name: 'Espírito Santo', x: 366, y: 286},
  {code: 'GO', name: 'Goiás', x: 292, y: 238},
  {code: 'MA', name: 'Maranhão', x: 354, y: 154},
  {code: 'MT', name: 'Mato Grosso', x: 240, y: 220},
  {code: 'MS', name: 'Mato Grosso do Sul', x: 260, y: 292},
  {code: 'MG', name: 'Minas Gerais', x: 332, y: 262},
  {code: 'PA', name: 'Pará', x: 292, y: 124},
  {code: 'PB', name: 'Paraíba', x: 444, y: 190},
  {code: 'PR', name: 'Paraná', x: 300, y: 342},
  {code: 'PE', name: 'Pernambuco', x: 432, y: 210},
  {code: 'PI', name: 'Piauí', x: 382, y: 176},
  {code: 'RJ', name: 'Rio de Janeiro', x: 352, y: 302},
  {code: 'RN', name: 'Rio Grande do Norte', x: 454, y: 176},
  {code: 'RS', name: 'Rio Grande do Sul', x: 286, y: 404},
  {code: 'RO', name: 'Rondônia', x: 138, y: 228},
  {code: 'RR', name: 'Roraima', x: 208, y: 48},
  {code: 'SC', name: 'Santa Catarina', x: 298, y: 370},
  {code: 'SP', name: 'São Paulo', x: 312, y: 314},
  {code: 'SE', name: 'Sergipe', x: 408, y: 252},
  {code: 'TO', name: 'Tocantins', x: 312, y: 182}
];

export default function InitialTerritorySelector() {
  const t = useTranslations('territory');
  const [selectedUf, setSelectedUf] = useState('');
  const [city, setCity] = useState('');
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityFetchFailed, setCityFetchFailed] = useState(false);

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

  const correlationId = useMemo(() => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `cid-${Date.now()}`;
  }, [selectedUf, city]);

  const traceId = useMemo(() => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `tid-${Date.now()}`;
  }, [selectedUf, city]);

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
      classification: 'publico'
    };

    localStorage.setItem('portacivis_territory', JSON.stringify(payload));
  };

  return (
    <section className="card territory-selector" aria-labelledby="territory-selector-title">
      <h2 id="territory-selector-title">{t('title')}</h2>
      <p>{t('description')}</p>

      <div className="territory-layout">
        <div className="territory-map-wrap" aria-label={t('mapAria')}>
          <svg viewBox="0 0 540 460" className="territory-map" role="img" aria-labelledby="map-title map-desc">
            <title id="map-title">{t('mapTitle')}</title>
            <desc id="map-desc">{t('mapDescription')}</desc>
            <path
              className="territory-outline"
              d="M112 108 L168 78 L248 52 L330 76 L408 132 L462 188 L458 250 L432 292 L378 336 L320 410 L250 432 L192 412 L136 350 L96 282 L74 220 L82 166 Z"
            />

            {FEDERATIVE_UNITS.map((uf) => {
              const active = uf.code === selectedUf;
              return (
                <g key={uf.code}>
                  <circle
                    cx={uf.x}
                    cy={uf.y}
                    r={active ? 8 : 6}
                    className={active ? 'uf-dot active' : 'uf-dot'}
                    onClick={() => setSelectedUf(uf.code)}
                  />
                  <text x={uf.x + 9} y={uf.y + 3} className="uf-label" onClick={() => setSelectedUf(uf.code)}>
                    {uf.code}
                  </text>
                </g>
              );
            })}
          </svg>
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

          <Link
            href={canProceed
              ? `/trilha-da-verdade?uf=${encodeURIComponent(selectedUf)}&cidade=${encodeURIComponent(city.trim())}&correlationId=${encodeURIComponent(correlationId)}&traceId=${encodeURIComponent(traceId)}`
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
