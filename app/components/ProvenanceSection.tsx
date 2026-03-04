'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import DataProvenanceCard from './DataProvenanceCard';
import TrailPermalinkPanel from './TrailPermalinkPanel';
import TrailPdfExport from './TrailPdfExport';
import { buildDemoProvenances, detectStaleness } from '../../src/transparency/provenance';

type Props = {
  hasTerritory: boolean;
  cidade: string;
  uf: string;
  layers: string[];
};

export default function ProvenanceSection({ hasTerritory, cidade, uf, layers }: Props) {
  const t = useTranslations('truthTrail');

  const provenances = useMemo(() => buildDemoProvenances(), []);
  const stalenessAlerts = useMemo(() => detectStaleness(provenances), [provenances]);
  const stalenessMap = useMemo(() => {
    const map: Record<string, (typeof stalenessAlerts)[0]> = {};
    for (const alert of stalenessAlerts) {
      map[alert.sourceId] = alert;
    }
    return map;
  }, [stalenessAlerts]);

  if (!hasTerritory) return null;

  return (
    <section className="card" aria-labelledby="trilha-proveniencia">
      <h2 id="trilha-proveniencia">{t('governanceTitle')}</h2>

      <div style={{ marginTop: '1rem' }}>
        {provenances.map(prov => (
          <DataProvenanceCard
            key={prov.id}
            provenance={prov}
            stalenessAlert={stalenessMap[prov.source.id]}
          />
        ))}
      </div>

      <TrailPermalinkPanel
        city={cidade}
        uf={uf}
        layers={layers}
        provenances={provenances}
      />

      <TrailPdfExport
        city={cidade}
        uf={uf}
        layers={layers}
        provenances={provenances}
        stalenessAlerts={stalenessAlerts}
      />
    </section>
  );
}
