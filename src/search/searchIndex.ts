import {SERVICOS} from '../smart-city/aurora';

export type SearchEntry = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  href: string;
  keywords: string[];
  /** Fallback label when i18n key is not resolved (e.g. Aurora services). */
  fallbackTitle?: string;
  fallbackDescription?: string;
};

const PAGE_ENTRIES: SearchEntry[] = [
  {
    id: 'home',
    titleKey: 'home.title',
    descriptionKey: 'home.description',
    href: '/',
    keywords: ['inicio', 'home', 'portal', 'cidadao'],
  },
  {
    id: 'trilha',
    titleKey: 'truthTrail.title',
    descriptionKey: 'truthTrail.description',
    href: '/trilha-da-verdade',
    keywords: ['trilha', 'verdade', 'truth', 'trail', 'auditoria', 'transparencia'],
  },
  {
    id: 'noticias',
    titleKey: 'newsPage.title',
    descriptionKey: 'newsPage.description',
    href: '/noticias',
    keywords: ['noticias', 'news', 'artigos', 'publicacoes', 'imprensa'],
  },
  {
    id: 'agentes',
    titleKey: 'agents.title',
    descriptionKey: 'agents.description',
    href: '/agentes',
    keywords: ['agentes', 'agents', 'ia', 'inteligencia', 'editor', 'conformidade'],
  },
  {
    id: 'conformidade',
    titleKey: 'compliancePage.title',
    descriptionKey: 'compliancePage.description',
    href: '/conformidade',
    keywords: ['conformidade', 'compliance', 'governanca', 'lgpd', 'auditoria'],
  },
  {
    id: 'aurora',
    titleKey: 'cidadeAurora.searchTitle',
    descriptionKey: 'cidadeAurora.searchDescription',
    href: '/cidade-aurora',
    keywords: ['aurora', 'smart city', 'demo', 'demonstracao', 'prefeitura'],
    fallbackTitle: 'Cidade Aurora',
    fallbackDescription: 'Ambiente demonstrativo Smart City EnvNeo',
  },
  {
    id: 'verificacao',
    titleKey: 'compliancePage.auditVerificationTitle',
    descriptionKey: 'compliancePage.auditVerificationDescription',
    href: '/verificacao-auditoria',
    keywords: ['verificacao', 'auditoria', 'hash', 'integridade', 'cadeia'],
  },
  {
    id: 'acessibilidade',
    titleKey: 'accessibilityPage.title',
    descriptionKey: 'accessibilityPage.description',
    href: '/accessibilidade',
    keywords: ['acessibilidade', 'accessibility', 'contraste', 'fonte', 'leitor'],
  },
  {
    id: 'privacidade',
    titleKey: 'privacyPage.title',
    descriptionKey: 'privacyPage.description',
    href: '/privacidade',
    keywords: ['privacidade', 'lgpd', 'dados', 'privacy', 'protecao'],
  },
];

const SERVICE_ENTRIES: SearchEntry[] = SERVICOS.map((srv) => ({
  id: `srv-${srv.id}`,
  titleKey: '',
  descriptionKey: '',
  href: `/cidade-aurora#servicos`,
  keywords: [srv.nome.toLowerCase(), srv.descricao.toLowerCase()],
  fallbackTitle: srv.nome,
  fallbackDescription: srv.descricao,
}));

export const SEARCH_INDEX: SearchEntry[] = [...PAGE_ENTRIES, ...SERVICE_ENTRIES];

export function searchEntries(query: string, entries: SearchEntry[]): SearchEntry[] {
  const normalized = query.toLowerCase().trim();
  if (normalized.length < 2) return [];

  const terms = normalized.split(/\s+/);

  return entries.filter((entry) => {
    const searchable = [
      entry.fallbackTitle ?? '',
      entry.fallbackDescription ?? '',
      ...entry.keywords,
    ]
      .join(' ')
      .toLowerCase();

    return terms.every((term) => searchable.includes(term));
  });
}
