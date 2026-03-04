'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { DataProvenance, StalenessAlert } from '../../src/transparency/types';
import { buildExportData } from '../../src/transparency/provenance';

type Props = {
  city: string;
  uf: string;
  layers: string[];
  provenances: DataProvenance[];
  stalenessAlerts: StalenessAlert[];
};

export default function TrailPdfExport({ city, uf, layers, provenances, stalenessAlerts }: Props) {
  const t = useTranslations('trailExport');
  const [exporting, setExporting] = useState(false);
  const [exportData, setExportData] = useState<ReturnType<typeof formatExport> | null>(null);

  const formatExport = useCallback((data: Awaited<ReturnType<typeof buildExportData>>) => {
    const lines: string[] = [];
    lines.push('═'.repeat(60));
    lines.push(`RELATÓRIO CIDADÃO — ${data.title.toUpperCase()}`);
    lines.push('═'.repeat(60));
    lines.push('');
    lines.push(`Município: ${data.city} — ${data.uf}`);
    lines.push(`Data de geração: ${new Date(data.generatedAt).toLocaleString('pt-BR')}`);
    lines.push(`Assinatura digital: ${data.signatureHash}`);
    lines.push('');
    lines.push('─'.repeat(60));
    lines.push('CAMADAS ANALISADAS');
    lines.push('─'.repeat(60));
    data.layers.forEach(l => lines.push(`  • ${l}`));
    lines.push('');
    lines.push('─'.repeat(60));
    lines.push('FONTES CONSULTADAS');
    lines.push('─'.repeat(60));
    data.provenances.forEach(p => {
      lines.push(`  • ${p.source.name}`);
      lines.push(`    URL: ${p.source.url}`);
      lines.push(`    Última atualização: ${new Date(p.lastUpdated).toLocaleDateString('pt-BR')}`);
      lines.push(`    Hash de verificação: ${p.contentHash}`);
      lines.push('');
    });
    if (data.stalenessAlerts.length > 0) {
      lines.push('─'.repeat(60));
      lines.push('ALERTAS DE DESATUALIZAÇÃO');
      lines.push('─'.repeat(60));
      data.stalenessAlerts.forEach(a => {
        lines.push(`  ⚠ ${a.sourceName} — ${a.daysSinceUpdate} dias sem atualização`);
      });
      lines.push('');
    }
    lines.push('─'.repeat(60));
    lines.push('Este relatório foi gerado automaticamente pelo PortaCivis.');
    lines.push('As informações são baseadas em fontes públicas verificáveis.');
    lines.push('─'.repeat(60));

    return lines.join('\n');
  }, []);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const title = `Trilha da Verdade — ${city}, ${uf}`;
      const data = await buildExportData(title, city, uf, layers, provenances, stalenessAlerts);
      const text = formatExport(data);
      setExportData(text);

      // Download as text file (PDF generation would require external lib)
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-cidadao-${city.toLowerCase().replace(/\s+/g, '-')}-${uf.toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, [city, uf, layers, provenances, stalenessAlerts, formatExport]);

  return (
    <div className="trail-export-panel" role="region" aria-label={t('title')}>
      <h3>{t('title')}</h3>
      <p>{t('description')}</p>
      <button
        type="button"
        className="trail-export-btn"
        onClick={handleExport}
        disabled={exporting}
      >
        {exporting ? t('exporting') : t('exportBtn')}
      </button>

      {exportData && (
        <details className="trail-export-preview">
          <summary>{t('previewTitle')}</summary>
          <pre className="trail-export-content" aria-label={t('previewTitle')}>
            {exportData}
          </pre>
        </details>
      )}
    </div>
  );
}
