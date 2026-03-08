'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {readSavedSelection} from '../../src/territory/persistence';

type Selection = {
  uf: string;
  city: string;
  correlationId?: string;
  traceId?: string;
  layers?: string[];
};

export default function TerritoryContextBar() {
  const t = useTranslations();
  const [selection, setSelection] = useState<Selection | null>(null);

  useEffect(() => {
    const saved = readSavedSelection();
    if (saved?.uf && saved?.city) {
      setSelection(saved as Selection);
    }
  }, []);

  if (!selection) return null;

  const trailHref = `/trilha-da-verdade?uf=${encodeURIComponent(selection.uf)}&cidade=${encodeURIComponent(selection.city)}${
    selection.correlationId ? `&correlationId=${encodeURIComponent(selection.correlationId)}` : ''
  }${selection.traceId ? `&traceId=${encodeURIComponent(selection.traceId)}` : ''}${
    selection.layers?.length ? `&layers=${encodeURIComponent(selection.layers.join(','))}` : ''
  }`;

  function label(key: string, fallback: string): string {
    try {
      return t(key as Parameters<typeof t>[0]);
    } catch {
      return fallback;
    }
  }

  return (
    <div className="territory-context-bar" role="status" aria-label={label('territoryBar.aria', 'Territorio selecionado')}>
      <div className="territory-context-bar-inner">
        <span className="territory-context-bar-label">
          <span aria-hidden="true">📍</span> {selection.city} — {selection.uf}
        </span>
        <div className="territory-context-bar-actions">
          <Link href="/#mapa-brasil" className="territory-context-bar-link">
            {label('territoryBar.change', 'Alterar')}
          </Link>
          <Link href={trailHref} className="territory-context-bar-link territory-context-bar-link--primary">
            {label('territoryBar.startTrail', 'Iniciar Trilha')} →
          </Link>
        </div>
      </div>
    </div>
  );
}
