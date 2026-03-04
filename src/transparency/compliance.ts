/**
 * Module 3 — Municipal Compliance Score calculation and demo data.
 */
import type {
  ComplianceScore,
  ComplianceDimension,
  ComplianceHistoryEntry,
  LAIRequest,
  DataSource,
} from './types';

// ── Compliance dimensions ─────────────────────────────────────────────────────

const COMPLIANCE_DIMENSIONS = [
  { id: 'portal_transparencia', name: 'Portal de Transparência', maxScore: 20 },
  { id: 'rreo_rgf', name: 'RREO e RGF em dia', maxScore: 25 },
  { id: 'lai', name: 'Lei de Acesso à Informação (LAI)', maxScore: 20 },
  { id: 'diario_oficial', name: 'Diário Oficial atualizado', maxScore: 15 },
  { id: 'esic', name: 'e-SIC ativo', maxScore: 20 },
] as const;

export function getComplianceDimensions() {
  return COMPLIANCE_DIMENSIONS;
}

// ── Color grade calculation ───────────────────────────────────────────────────

export function getColorGrade(score: number): 'green' | 'yellow' | 'red' | 'gray' {
  if (score >= 80) return 'green';
  if (score >= 50) return 'yellow';
  if (score >= 0) return 'red';
  return 'gray';
}

export function getColorGradeHex(grade: 'green' | 'yellow' | 'red' | 'gray'): string {
  switch (grade) {
    case 'green': return 'rgb(22 163 74)';
    case 'yellow': return 'rgb(202 138 4)';
    case 'red': return 'rgb(220 38 38)';
    case 'gray': return 'rgb(156 163 175)';
  }
}

// ── Score builder ─────────────────────────────────────────────────────────────

function dimensionStatus(score: number, maxScore: number): 'compliant' | 'partial' | 'non_compliant' | 'no_data' {
  const pct = (score / maxScore) * 100;
  if (pct >= 80) return 'compliant';
  if (pct >= 50) return 'partial';
  if (pct > 0) return 'non_compliant';
  return 'no_data';
}

export function buildComplianceScore(
  cityCode: string,
  cityName: string,
  uf: string,
  dimensionScores: { id: string; score: number; lastChecked: string; sourceUrl: string }[]
): ComplianceScore {
  const dimensions: ComplianceDimension[] = COMPLIANCE_DIMENSIONS.map(dim => {
    const input = dimensionScores.find(d => d.id === dim.id);
    const score = input?.score ?? 0;
    return {
      id: dim.id,
      name: dim.name,
      score,
      maxScore: dim.maxScore,
      status: input ? dimensionStatus(score, dim.maxScore) : 'no_data',
      lastChecked: input?.lastChecked ?? new Date().toISOString(),
      source: {
        id: `src-${dim.id}`,
        name: dim.name,
        url: input?.sourceUrl ?? '#',
        type: dim.id === 'portal_transparencia' ? 'portal_transparencia'
            : dim.id === 'rreo_rgf' ? 'tcu'
            : dim.id === 'lai' ? 'lai'
            : dim.id === 'diario_oficial' ? 'diario_oficial'
            : 'esic',
      } as DataSource,
    };
  });

  const overallScore = Math.round(
    dimensions.reduce((acc, d) => acc + (d.score / d.maxScore) * 100, 0) / dimensions.length
  );

  return {
    cityCode,
    cityName,
    uf,
    overallScore,
    colorGrade: getColorGrade(overallScore),
    dimensions,
    lastCalculated: new Date().toISOString(),
    history: [],
  };
}

// ── LAI request generator ─────────────────────────────────────────────────────

export function generateLAIRequest(score: ComplianceScore): LAIRequest {
  const nonCompliant = score.dimensions
    .filter(d => d.status === 'non_compliant' || d.status === 'no_data')
    .map(d => d.name);

  const template = `Prezada Ouvidoria do Município de ${score.cityName} — ${score.uf},

Com fundamento na Lei nº 12.527/2011 (Lei de Acesso à Informação), venho, na condição de cidadão(ã), solicitar informações sobre as seguintes dimensões de conformidade municipal que apresentam deficiências:

${nonCompliant.map((d, i) => `${i + 1}. ${d}`).join('\n')}

Score de conformidade detectado: ${score.overallScore}/100.

Solicito que as informações sejam disponibilizadas no prazo legal de 20 dias corridos, conforme art. 11, §1º da LAI.

Dados gerados automaticamente pelo PortaCivis — Portal do Cidadão.
Data da consulta: ${new Date().toLocaleDateString('pt-BR')}.

Atenciosamente,
[Seu nome]`;

  return {
    cityName: score.cityName,
    uf: score.uf,
    ouvidoriaEmail: `ouvidoria@${score.cityName.toLowerCase().replace(/\s+/g, '')}.${score.uf.toLowerCase()}.gov.br`,
    dimensions: nonCompliant,
    templateText: template,
    generatedAt: new Date().toISOString(),
  };
}

// ── Demo data ─────────────────────────────────────────────────────────────────

function generateHistory(baseScore: number, months: number): ComplianceHistoryEntry[] {
  const history: ComplianceHistoryEntry[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const variation = Math.floor(Math.random() * 10) - 3;
    const score = Math.max(0, Math.min(100, baseScore + variation));
    history.push({
      date: d.toISOString().slice(0, 7),
      score,
      colorGrade: getColorGrade(score),
    });
  }
  return history;
}

export function getDemoComplianceScores(): ComplianceScore[] {
  const now = new Date().toISOString();

  const aurora = buildComplianceScore('aurora-mg', 'Cidade Aurora', 'MG', [
    { id: 'portal_transparencia', score: 19, lastChecked: now, sourceUrl: 'https://transparencia.cidadeaurora.mg.gov.br' },
    { id: 'rreo_rgf', score: 23, lastChecked: now, sourceUrl: 'https://tcu.gov.br/rreo/aurora' },
    { id: 'lai', score: 18, lastChecked: now, sourceUrl: 'https://lai.cidadeaurora.mg.gov.br' },
    { id: 'diario_oficial', score: 14, lastChecked: now, sourceUrl: 'https://diario.cidadeaurora.mg.gov.br' },
    { id: 'esic', score: 19, lastChecked: now, sourceUrl: 'https://esic.cidadeaurora.mg.gov.br' },
  ]);
  aurora.history = generateHistory(94, 12);

  const exemploA = buildComplianceScore('exemplo-a-sp', 'Município Exemplo A', 'SP', [
    { id: 'portal_transparencia', score: 12, lastChecked: now, sourceUrl: '#' },
    { id: 'rreo_rgf', score: 15, lastChecked: now, sourceUrl: '#' },
    { id: 'lai', score: 10, lastChecked: now, sourceUrl: '#' },
    { id: 'diario_oficial', score: 8, lastChecked: now, sourceUrl: '#' },
    { id: 'esic', score: 11, lastChecked: now, sourceUrl: '#' },
  ]);
  exemploA.history = generateHistory(62, 12);

  const exemploB = buildComplianceScore('exemplo-b-rj', 'Município Exemplo B', 'RJ', [
    { id: 'portal_transparencia', score: 5, lastChecked: now, sourceUrl: '#' },
    { id: 'rreo_rgf', score: 8, lastChecked: now, sourceUrl: '#' },
    { id: 'lai', score: 4, lastChecked: now, sourceUrl: '#' },
    { id: 'diario_oficial', score: 3, lastChecked: now, sourceUrl: '#' },
    { id: 'esic', score: 2, lastChecked: now, sourceUrl: '#' },
  ]);
  exemploB.history = generateHistory(28, 12);

  const exemploC = buildComplianceScore('exemplo-c-ba', 'Município Exemplo C', 'BA', [
    { id: 'portal_transparencia', score: 17, lastChecked: now, sourceUrl: '#' },
    { id: 'rreo_rgf', score: 20, lastChecked: now, sourceUrl: '#' },
    { id: 'lai', score: 16, lastChecked: now, sourceUrl: '#' },
    { id: 'diario_oficial', score: 13, lastChecked: now, sourceUrl: '#' },
    { id: 'esic', score: 17, lastChecked: now, sourceUrl: '#' },
  ]);
  exemploC.history = generateHistory(85, 12);

  const exemploD = buildComplianceScore('exemplo-d-rs', 'Município Exemplo D', 'RS', []);
  exemploD.history = [];

  return [aurora, exemploA, exemploB, exemploC, exemploD];
}
