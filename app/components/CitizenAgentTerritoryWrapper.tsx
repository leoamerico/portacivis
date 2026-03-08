'use client';

import {useEffect, useState} from 'react';
import {readSavedSelection} from '../../src/territory/persistence';
import CitizenAgentPanel from './CitizenAgentPanel';

type TerritoryContext = {
  cityName: string;
  uf: string;
  population: number;
  region: string;
};

const FALLBACK: TerritoryContext = {
  cityName: 'Cidade Aurora',
  uf: 'MG',
  population: 120_000,
  region: 'Sudeste — Minas Gerais',
};

export default function CitizenAgentTerritoryWrapper() {
  const [ctx, setCtx] = useState<TerritoryContext>(FALLBACK);

  useEffect(() => {
    const saved = readSavedSelection();
    if (saved?.uf && saved?.city) {
      setCtx({
        cityName: saved.city,
        uf: saved.uf,
        population: 0,
        region: saved.uf,
      });
    }
  }, []);

  return (
    <CitizenAgentPanel
      cityName={ctx.cityName}
      uf={ctx.uf}
      population={ctx.population}
      region={ctx.region}
    />
  );
}
