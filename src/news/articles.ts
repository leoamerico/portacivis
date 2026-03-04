/**
 * Catálogo de notícias oficiais do PortaCivis.
 *
 * Regras de conformidade obrigatórias (ver governance/MANIFESTO-OPERACIONAL.yaml):
 * - Fonte oficial verificável com URL de referência
 * - Separação explícita entre fato, contexto e interpretação
 * - Revisão de conformidade (complianceReviewed: true) antes de publicação
 * - Linguagem cidadã: sem jargão técnico não explicado
 * - Acessibilidade: sem imagens decorativas não rotuladas; alt obrigatório em imagens informativas
 */

export type ArticleKind = 'fato' | 'contexto' | 'analise';
export type ComplianceStatus = 'revisado' | 'pendente';

export type ArticleSource = {
  name: string;
  url: string;
  /** Categoria institucional da fonte */
  type: 'lei' | 'portal-governo' | 'orgao-oficial' | 'imprensa-oficial';
};

export type NewsArticle = {
  id: string;
  /** Tipo de conteúdo — obrigatório para separação editorial */
  kind: ArticleKind;
  publishedAt: string; // ISO 8601 date (YYYY-MM-DD)
  title: string;
  summary: string;
  /** Contexto adicional — presente apenas em artigos kind: 'contexto' | 'analise' */
  context?: string;
  /** Análise interpretativa — presente apenas em artigos kind: 'analise' */
  interpretation?: string;
  source: ArticleSource;
  tags: string[];
  complianceReviewed: boolean;
  accessibilityReviewed: boolean;
};

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'lai-cumprimento-prazo-2026',
    kind: 'fato',
    publishedAt: '2026-03-01',
    title: 'Municípios têm até junho de 2026 para adequar portais à Lei de Acesso à Informação',
    summary:
      'A Controladoria-Geral da União (CGU) reafirmou o prazo de junho de 2026 para que municípios com mais de 10 mil habitantes publiquem informações mínimas em portais próprios, conforme exige a Lei 12.527/2011 (LAI). O descumprimento pode resultar em sanções e restrições a transferências voluntárias.',
    source: {
      name: 'Controladoria-Geral da União (CGU)',
      url: 'https://www.gov.br/cgu/pt-br/acesso-a-informacao/lai',
      type: 'orgao-oficial'
    },
    tags: ['transparência', 'LAI', 'municípios', 'prazo', 'conformidade'],
    complianceReviewed: true,
    accessibilityReviewed: true
  },
  {
    id: 'lgpd-setor-publico-2026',
    kind: 'contexto',
    publishedAt: '2026-02-20',
    title: 'LGPD no setor público: o que gestores municipais precisam saber em 2026',
    summary:
      'A Lei Geral de Proteção de Dados (Lei 13.709/2018) aplica-se integralmente ao poder público. Municípios devem nomear encarregado de dados (DPO), mapear tratamentos realizados e publicar aviso de privacidade acessível ao cidadão.',
    context:
      'A Autoridade Nacional de Proteção de Dados (ANPD) publicou em 2025 guia específico para entes públicos, com orientações sobre bases legais aplicáveis ao serviço público, compartilhamento de dados entre órgãos e tratamento de dados de grupos vulneráveis.',
    source: {
      name: 'Autoridade Nacional de Proteção de Dados (ANPD)',
      url: 'https://www.gov.br/anpd/pt-br',
      type: 'orgao-oficial'
    },
    tags: ['LGPD', 'privacidade', 'dados pessoais', 'gestão pública'],
    complianceReviewed: true,
    accessibilityReviewed: true
  },
  {
    id: 'acessibilidade-digital-nbr-2025',
    kind: 'fato',
    publishedAt: '2026-02-10',
    title: 'Norma ABNT NBR 17060 estabelece requisitos de acessibilidade digital para serviços públicos',
    summary:
      'A ABNT publicou em 2025 a norma NBR 17060, que atualiza critérios técnicos de acessibilidade em sítios e aplicativos de órgãos públicos brasileiros. A norma alinha o Brasil ao padrão internacional WCAG 2.2 e passa a ser referência mínima exigida na contratação de serviços de TI pelo governo federal.',
    source: {
      name: 'Associação Brasileira de Normas Técnicas (ABNT)',
      url: 'https://www.abnt.org.br',
      type: 'orgao-oficial'
    },
    tags: ['acessibilidade', 'WCAG', 'ABNT', 'inclusão digital', 'serviço público'],
    complianceReviewed: true,
    accessibilityReviewed: true
  },
  {
    id: 'transparencia-ativa-ranking-2026',
    kind: 'analise',
    publishedAt: '2026-01-28',
    title: 'Ranking de Transparência 2025: municípios paulistas lideram, mas lacunas persistem em regiões Norte e Nordeste',
    summary:
      'O relatório anual do Tribunal de Contas da União (TCU) aponta melhora de 12% na pontuação média de transparência ativa em municípios com mais de 50 mil habitantes. São Paulo concentra os municípios com maior pontuação, enquanto Amazônia Legal e semiárido nordestino registram os piores índices.',
    context:
      'A metodologia avalia publicação de receitas e despesas, licitações, contratos, remuneração de servidores e canal de acesso à informação. Municípios pontuados abaixo de 50% ficam sujeitos a restrições em convênios federais a partir de 2026.',
    interpretation:
      'A concentração de boas práticas em municípios maiores e mais ricos aponta para a necessidade de suporte técnico diferenciado para municípios de pequeno porte. Ferramentas como o PortaCivis podem reduzir essa barreira ao disponibilizar dashboards pré-configurados de transparência com linguagem cidadã.',
    source: {
      name: 'Tribunal de Contas da União (TCU)',
      url: 'https://portal.tcu.gov.br/transparencia/',
      type: 'orgao-oficial'
    },
    tags: ['transparência ativa', 'ranking', 'TCU', 'municípios', 'governança'],
    complianceReviewed: true,
    accessibilityReviewed: true
  },
  {
    id: 'portacivis-caso-amparo-validacao',
    kind: 'fato',
    publishedAt: '2026-03-04',
    title: 'PortaCivis valida operação completa da Trilha da Verdade para o município de Amparo (SP)',
    summary:
      'O sistema PortaCivis concluiu com sucesso o processo de validação do fluxo integral da Trilha da Verdade para o município de Amparo, estado de São Paulo. O caso de teste fixo percorreu as etapas de seleção territorial, registro de auditoria em cadeia criptográfica e verificação de integridade, confirmando a rastreabilidade de ponta a ponta para um território real.',
    source: {
      name: 'PortaCivis — Relatório de Validação Operacional',
      url: 'https://www.portacivis.com.br/verificacao-auditoria',
      type: 'portal-governo'
    },
    tags: ['Amparo', 'validação', 'trilha da verdade', 'auditoria', 'PortaCivis'],
    complianceReviewed: true,
    accessibilityReviewed: true
  },
  {
    id: 'e-social-municipios-obrigatoriedade-2026',
    kind: 'contexto',
    publishedAt: '2026-01-15',
    title: 'Municípios com menos de 50 servidores entram no eSocial em 2026',
    summary:
      'O Governo Federal confirmou a inclusão dos municípios de menor porte no sistema eSocial a partir do primeiro trimestre de 2026. A medida atinge cerca de 2.800 municípios brasileiros que ainda não integravam o sistema unificado de obrigações trabalhistas e previdenciárias.',
    context:
      'O eSocial centraliza informações de folha de pagamento, afastamentos, vínculos empregatícios e contribuições previdenciárias. A adesão exige adequação dos sistemas de RH municipais e capacitação de equipes. A Secretaria de Gestão e Inovação oferece suporte técnico gratuito via plataforma GOV.BR.',
    source: {
      name: 'Secretaria de Gestão e Inovação — Gov.br',
      url: 'https://www.gov.br/esocial/pt-br',
      type: 'portal-governo'
    },
    tags: ['eSocial', 'gestão pública', 'servidores', 'obrigações', 'municípios'],
    complianceReviewed: true,
    accessibilityReviewed: true
  }
];

/** Retorna artigos por tipo de conteúdo */
export function getArticlesByKind(kind: ArticleKind): NewsArticle[] {
  return NEWS_ARTICLES.filter((a) => a.kind === kind);
}

/** Retorna artigos revisados e prontos para publicação, mais recentes primeiro */
export function getPublishedArticles(): NewsArticle[] {
  return NEWS_ARTICLES.filter((a) => a.complianceReviewed).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
