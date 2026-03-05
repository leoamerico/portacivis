'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { DataProvenance, TrailPermalink } from '../../src/transparency/types';
import { generatePermalink } from '../../src/transparency/provenance';

type Props = {
  city: string;
  uf: string;
  layers: string[];
  provenances: DataProvenance[];
};

export default function TrailPermalinkPanel({ city, uf, layers, provenances }: Props) {
  const t = useTranslations('trailPermalink');
  const [permalink, setPermalink] = useState<TrailPermalink | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      const now = new Date();
      const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      const title = `${layers.join(', ')} em ${city} — ${monthNames[now.getMonth()]}/${now.getFullYear()}`;
      const pl = await generatePermalink(title, city, uf, layers, provenances);
      setPermalink(pl);
    } finally {
      setGenerating(false);
    }
  }, [city, uf, layers, provenances]);

  const handleCopy = useCallback(async () => {
    if (!permalink) return;
    const url = `${window.location.origin}/trilha-da-verdade?permalink=${permalink.id}&hash=${permalink.snapshotHash}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
    }
  }, [permalink]);

  return (
    <div className="trail-permalink-panel" role="region" aria-label={t('title')}>
      <h3>{t('title')}</h3>
      <p>{t('description')}</p>

      {!permalink ? (
        <button
          type="button"
          className="trail-permalink-generate"
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? t('generating') : t('generate')}
        </button>
      ) : (
        <div className="trail-permalink-result">
          <div className="trail-permalink-info">
            <p className="trail-permalink-title">{permalink.title}</p>
            <p className="trail-permalink-meta">
              {t('createdAt')}: {new Date(permalink.createdAt).toLocaleString('pt-BR')}
            </p>
            <p className="trail-permalink-hash">
              Selo de verificação: <code>{permalink.snapshotHash.slice(0, 16)}…</code>
            </p>
          </div>
          <div className="trail-permalink-actions">
            <button
              type="button"
              className="trail-permalink-copy"
              onClick={handleCopy}
              aria-label={t('copyLink')}
            >
              {copied ? t('copied') : t('copyLink')}
            </button>
            <button
              type="button"
              className="trail-permalink-new"
              onClick={handleGenerate}
            >
              {t('regenerate')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
