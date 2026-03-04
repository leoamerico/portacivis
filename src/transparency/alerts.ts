/**
 * Module 4 — Smart alerts system: subscription, severity, deduplication, expiration.
 */
import type { Alert, AlertSeverity, AlertSubscription, DataSource } from './types';

// ── Severity helpers ──────────────────────────────────────────────────────────

export function getSeverityIcon(severity: AlertSeverity): string {
  switch (severity) {
    case 'urgent': return '🚨';
    case 'attention': return '⚠️';
    case 'informative': return 'ℹ️';
  }
}

export function getSeverityLabel(severity: AlertSeverity, locale: string): string {
  const labels: Record<string, Record<AlertSeverity, string>> = {
    'pt-BR': { urgent: 'URGENTE', attention: 'ATENÇÃO', informative: 'INFORMATIVO' },
    'en-US': { urgent: 'URGENT', attention: 'ATTENTION', informative: 'INFORMATIVE' },
    'es-ES': { urgent: 'URGENTE', attention: 'ATENCIÓN', informative: 'INFORMATIVO' },
  };
  return labels[locale]?.[severity] ?? labels['pt-BR'][severity];
}

// ── Deduplication ─────────────────────────────────────────────────────────────

export function deduplicateAlerts(alerts: Alert[]): Alert[] {
  const seen = new Map<string, Alert>();
  for (const alert of alerts) {
    const existing = seen.get(alert.deduplicationKey);
    if (existing) {
      // Merge sources from duplicate
      const existingSources = new Set(existing.sources.map(s => s.id));
      for (const source of alert.sources) {
        if (!existingSources.has(source.id)) {
          existing.sources.push(source);
        }
      }
    } else {
      seen.set(alert.deduplicationKey, { ...alert, sources: [...alert.sources] });
    }
  }
  return Array.from(seen.values());
}

// ── Expiration ────────────────────────────────────────────────────────────────

export function partitionAlerts(alerts: Alert[]): { active: Alert[]; expired: Alert[] } {
  const now = Date.now();
  const active: Alert[] = [];
  const expired: Alert[] = [];
  for (const alert of alerts) {
    if (new Date(alert.expiresAt).getTime() < now) {
      expired.push({ ...alert, isExpired: true });
    } else {
      active.push({ ...alert, isExpired: false });
    }
  }
  active.sort((a, b) => {
    const severityOrder: Record<AlertSeverity, number> = { urgent: 0, attention: 1, informative: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
  return { active, expired };
}

// ── Subscription (client-side localStorage) ──────────────────────────────────

const SUBSCRIPTIONS_KEY = 'portacivis_alert_subscriptions';

export function getSubscriptions(): AlertSubscription[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SUBSCRIPTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSubscription(sub: AlertSubscription): void {
  if (typeof window === 'undefined') return;
  const subs = getSubscriptions();
  const existing = subs.findIndex(s => s.id === sub.id);
  if (existing >= 0) {
    subs[existing] = sub;
  } else {
    subs.push(sub);
  }
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subs));
}

export function removeSubscription(id: string): void {
  if (typeof window === 'undefined') return;
  const subs = getSubscriptions().filter(s => s.id !== id);
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subs));
}

// ── RSS URL builder ───────────────────────────────────────────────────────────

export function buildRssUrl(cityCode: string, categories: string[]): string {
  const params = new URLSearchParams();
  params.set('city', cityCode);
  categories.forEach(c => params.append('cat', c));
  return `/api/alerts/rss?${params.toString()}`;
}

// ── Demo alerts ───────────────────────────────────────────────────────────────

export function getDemoAlerts(): Alert[] {
  const now = new Date();
  const inFuture = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
  const inPast = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

  const src = (name: string, url: string): DataSource => ({
    id: `src-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    url,
    type: 'outro',
  });

  return [
    {
      id: 'alert-001',
      title: 'Alerta de enchente — Bairro Santa Luzia',
      description: 'Defesa Civil emitiu alerta de risco de enchente para a região do Bairro Santa Luzia. Moradores devem procurar áreas elevadas.',
      severity: 'urgent',
      cityCode: 'aurora-mg',
      cityName: 'Cidade Aurora',
      uf: 'MG',
      category: 'seguranca',
      sources: [src('Defesa Civil MG', 'https://defesacivil.mg.gov.br'), src('Prefeitura de Cidade Aurora', 'https://cidadeaurora.mg.gov.br')],
      createdAt: inPast(0),
      expiresAt: inFuture(3),
      isExpired: false,
      deduplicationKey: 'enchente-santa-luzia-2026-03',
    },
    {
      id: 'alert-002',
      title: 'Vacinação contra gripe — campanha ampliada',
      description: 'A partir de hoje, todas as UBS de Cidade Aurora oferecem vacinação contra gripe para maiores de 6 meses, sem necessidade de agendamento.',
      severity: 'attention',
      cityCode: 'aurora-mg',
      cityName: 'Cidade Aurora',
      uf: 'MG',
      category: 'saude',
      sources: [src('Secretaria de Saúde', 'https://saude.cidadeaurora.mg.gov.br')],
      createdAt: inPast(2),
      expiresAt: inFuture(28),
      isExpired: false,
      deduplicationKey: 'vacinacao-gripe-2026-03',
    },
    {
      id: 'alert-003',
      title: 'Novo sistema de agendamento escolar',
      description: 'O sistema de matrícula escolar online foi atualizado. Pais e responsáveis devem acessar o portal para confirmar a matrícula do próximo semestre.',
      severity: 'informative',
      cityCode: 'aurora-mg',
      cityName: 'Cidade Aurora',
      uf: 'MG',
      category: 'educacao',
      sources: [src('Secretaria de Educação', 'https://educacao.cidadeaurora.mg.gov.br')],
      createdAt: inPast(5),
      expiresAt: inFuture(25),
      isExpired: false,
      deduplicationKey: 'matricula-escolar-2026-03',
    },
    {
      id: 'alert-004',
      title: 'Prazo final para IPTU com desconto',
      description: 'O pagamento do IPTU 2026 com desconto de 10% vence em 15 dias. Emita o boleto pelo portal de serviços.',
      severity: 'attention',
      cityCode: 'aurora-mg',
      cityName: 'Cidade Aurora',
      uf: 'MG',
      category: 'fiscal',
      sources: [src('Secretaria de Finanças', 'https://financas.cidadeaurora.mg.gov.br')],
      createdAt: inPast(1),
      expiresAt: inFuture(15),
      isExpired: false,
      deduplicationKey: 'iptu-desconto-2026',
    },
    {
      id: 'alert-005',
      title: 'Interdição da Av. das Flores para recape',
      description: 'A Avenida das Flores estará interditada entre Rua 7 e Rua 12 para obras de recapeamento. Use rotas alternativas.',
      severity: 'informative',
      cityCode: 'aurora-mg',
      cityName: 'Cidade Aurora',
      uf: 'MG',
      category: 'mobilidade',
      sources: [src('Secretaria de Obras', 'https://obras.cidadeaurora.mg.gov.br')],
      createdAt: inPast(10),
      expiresAt: inPast(2),
      isExpired: true,
      deduplicationKey: 'interdicao-flores-2026-02',
    },
  ];
}
