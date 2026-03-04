import type {Metadata} from 'next';
import Link from 'next/link';
import {
  CIDADE_AURORA,
  SECRETARIAS,
  SERVICOS,
  CONTRATOS,
  OBRAS,
  INDICADORES
} from '../../src/smart-city/aurora';
import AuroraDemoWrapper from '../components/AuroraDemoWrapper';

export const metadata: Metadata = {
  title: 'Cidade Aurora — Smart City EnvNeo | PortaCivis',
  description:
    'Painel demonstrativo do ecossistema EnvNeo. Cidade Aurora é uma prefeitura fictícia inteiramente digitalizada: 84 serviços digitais, 12 secretarias, transparência 94/100.',
  openGraph: {
    title: 'Cidade Aurora — Ambiente Demonstrativo EnvNeo',
    description: 'Prefeitura digital de demonstração: transparência, contratos, obras e indicadores em tempo real.',
    type: 'website'
  }
};

const PERSONAS = [
  {
    id: 'cidadao',
    label: 'Cidadão',
    icon: '👤',
    descricao: 'Acesse serviços públicos digitais, consulte informações e acompanhe obras e contratos no seu município.',
    cta: 'Acessar serviços',
    href: '#servicos',
    accent: 'var(--color-brand-primary)'
  },
  {
    id: 'gestor',
    label: 'Gestor',
    icon: '🏛',
    descricao: 'Gerencie secretarias, acompanhe indicadores de desempenho e controle o orçamento municipal em tempo real.',
    cta: 'Ver indicadores',
    href: '#indicadores',
    accent: 'rgb(5 150 105)'
  },
  {
    id: 'especialista',
    label: 'Especialista',
    icon: '📊',
    descricao: 'Analise contratos, licitações e obras com rastreabilidade completa e trilha de auditoria criptográfica.',
    cta: 'Ver contratos',
    href: '#contratos',
    accent: 'rgb(124 58 237)'
  },
  {
    id: 'desenvolvedor',
    label: 'Desenvolvedor',
    icon: '⚙️',
    descricao: 'Integre-se ao ecossistema EnvNeo via APIs abertas, webhooks e documentação técnica completa.',
    cta: 'API & Docs',
    href: '/trilha-da-verdade',
    accent: 'rgb(234 88 12)'
  }
];

const STATUS_OBRA_LABEL: Record<string, string> = {
  'em-execucao': 'Em execução',
  'concluida': 'Concluída',
  'paralisada': 'Paralisada',
  'licitacao': 'Em licitação'
};

const STATUS_SERVICO_LABEL: Record<string, string> = {
  'disponivel': 'Disponível',
  'em-breve': 'Em breve',
  'manutencao': 'Manutenção'
};

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

type SearchParams = Record<string, string | string[] | undefined>;

export default async function CidadeAuroraPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const demoMode = params.demo === 'true';
  const totalOrcamento = SECRETARIAS.reduce((acc, s) => acc + s.orcamento, 0);
  const totalServicos = SERVICOS.filter((s) => s.status === 'disponivel').length;
  const totalContratosVigentes = CONTRATOS.filter((c) => c.status === 'vigente').length;
  const totalObrasEmExecucao = OBRAS.filter((o) => o.status === 'em-execucao').length;

  return (
    <main id="conteudo-principal" role="main" className="aurora-page">

      {/* ── Breadcrumb ── */}
      <nav aria-label="Localização na página" className="inner-breadcrumb">
        <Link href="/">Início</Link>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">Cidade Aurora</span>
      </nav>

      {/* ── Hero ── */}
      <div id="demo-section-hero" className="page-hero aurora-hero">
        <div className="aurora-hero-badge">🌆 Ambiente Demonstrativo EnvNeo</div>
        <h1>{CIDADE_AURORA.nome}</h1>
        <p className="aurora-hero-sub">
          {CIDADE_AURORA.ufNome} · {formatNumber(CIDADE_AURORA.populacao)} habitantes · {CIDADE_AURORA.area}
        </p>
        <p>{CIDADE_AURORA.descricao}</p>
        <div className="aurora-hero-actions">
          <Link href="/trilha-da-verdade?uf=MG&cidade=Cidade+Aurora&correlationId=aurora-demo&traceId=aurora-demo-trace&layers=public_services%2Ccompliance%2Calerts"
                className="territory-cta territory-cta--ready aurora-hero-cta">
            <span className="territory-cta-icon" aria-hidden="true">▶</span>
            <span className="territory-cta-label">Iniciar Trilha da Verdade</span>
            <span className="territory-cta-arrow" aria-hidden="true">→</span>
          </Link>
          <Link href="/" className="aurora-hero-back">
            ← Selecionar outro município
          </Link>
        </div>
      </div>

      {/* ── Demo controller (Module 5) ── */}
      <AuroraDemoWrapper presentationMode={demoMode} />

      {/* ── Stats summary ── */}
      <section id="demo-section-stats" aria-label="Dados gerais do município" className="aurora-stats-grid">
        <div className="aurora-stat-card">
          <span className="aurora-stat-icon" aria-hidden="true">👥</span>
          <strong className="aurora-stat-value">{formatNumber(CIDADE_AURORA.populacao)}</strong>
          <span className="aurora-stat-label">Habitantes</span>
        </div>
        <div className="aurora-stat-card">
          <span className="aurora-stat-icon" aria-hidden="true">💰</span>
          <strong className="aurora-stat-value">{formatBRL(CIDADE_AURORA.orcamentoAnual)}</strong>
          <span className="aurora-stat-label">Orçamento anual</span>
        </div>
        <div className="aurora-stat-card">
          <span className="aurora-stat-icon" aria-hidden="true">🏛</span>
          <strong className="aurora-stat-value">{CIDADE_AURORA.secretarias}</strong>
          <span className="aurora-stat-label">Secretarias</span>
        </div>
        <div className="aurora-stat-card">
          <span className="aurora-stat-icon" aria-hidden="true">💻</span>
          <strong className="aurora-stat-value">{totalServicos}</strong>
          <span className="aurora-stat-label">Serviços digitais ativos</span>
        </div>
        <div className="aurora-stat-card">
          <span className="aurora-stat-icon" aria-hidden="true">📋</span>
          <strong className="aurora-stat-value">{totalContratosVigentes}</strong>
          <span className="aurora-stat-label">Contratos vigentes</span>
        </div>
        <div className="aurora-stat-card">
          <span className="aurora-stat-icon" aria-hidden="true">🏗</span>
          <strong className="aurora-stat-value">{totalObrasEmExecucao}</strong>
          <span className="aurora-stat-label">Obras em execução</span>
        </div>
      </section>

      {/* ── Personas ── */}
      <section aria-labelledby="personas-title" className="aurora-section">
        <h2 id="personas-title" className="aurora-section-title">Como posso ajudar você?</h2>
        <p className="aurora-section-sub">Cidade Aurora atende diferentes perfis de usuário no ecossistema EnvNeo.</p>
        <div className="aurora-personas-grid">
          {PERSONAS.map((p) => (
            <div key={p.id} className="aurora-persona-card" style={{'--persona-accent': p.accent} as React.CSSProperties}>
              <span className="aurora-persona-icon" aria-hidden="true">{p.icon}</span>
              <h3 className="aurora-persona-label">{p.label}</h3>
              <p className="aurora-persona-desc">{p.descricao}</p>
              <Link href={p.href} className="aurora-persona-cta">{p.cta} →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Indicadores ── */}
      <section id="indicadores" aria-labelledby="indicadores-title" className="aurora-section">
        <h2 id="indicadores-title" className="aurora-section-title">📊 Indicadores de Gestão</h2>
        <p className="aurora-section-sub">Desempenho atual da prefeitura em tempo real.</p>
        <div className="aurora-indicadores-grid">
          {INDICADORES.map((ind) => (
            <div key={ind.id} className="aurora-indicador-card">
              <span className="aurora-indicador-icon" aria-hidden="true">{ind.icon}</span>
              <strong className="aurora-indicador-value">{ind.valor}</strong>
              <span className="aurora-indicador-name">{ind.nome}</span>
              <span
                className={`aurora-indicador-trend aurora-indicador-trend--${ind.tendencia}`}
                aria-label={`Tendência: ${ind.tendencia}`}
              >
                {ind.tendencia === 'alta' ? '↑' : ind.tendencia === 'baixa' ? '↓' : '→'}
              </span>
              <p className="aurora-indicador-desc">{ind.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Secretarias ── */}
      <section aria-labelledby="secretarias-title" className="aurora-section">
        <h2 id="secretarias-title" className="aurora-section-title">🏛 Secretarias Municipais</h2>
        <p className="aurora-section-sub">
          {CIDADE_AURORA.secretarias} secretarias · orçamento total: <strong>{formatBRL(totalOrcamento)}</strong>
        </p>
        <div className="aurora-secretarias-grid">
          {SECRETARIAS.map((sec) => (
            <div key={sec.id} className="aurora-secretaria-card">
              <span className="aurora-secretaria-icon" aria-hidden="true">{sec.icon}</span>
              <div className="aurora-secretaria-info">
                <strong className="aurora-secretaria-nome">{sec.sigla}: {sec.nome}</strong>
                <span className="aurora-secretaria-responsavel">Responsável: {sec.responsavel}</span>
                <span className="aurora-secretaria-orcamento">{formatBRL(sec.orcamento)}</span>
                <span className="aurora-secretaria-servicos">{sec.servicosAtivos} serviços</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Serviços ── */}
      <section id="servicos" aria-labelledby="servicos-title" className="aurora-section" data-demo-section="servicos">
        <h2 id="servicos-title" className="aurora-section-title">💻 Catálogo de Serviços Digitais</h2>
        <p className="aurora-section-sub">{SERVICOS.length} serviços catalogados · {totalServicos} disponíveis hoje</p>
        <ul className="aurora-servicos-list" role="list">
          {SERVICOS.map((srv) => (
            <li key={srv.id} className={`aurora-servico-item aurora-servico-item--${srv.status}`}>
              <span className="aurora-servico-icon" aria-hidden="true">{srv.icon}</span>
              <div className="aurora-servico-body">
                <strong className="aurora-servico-nome">{srv.nome}</strong>
                <p className="aurora-servico-desc">{srv.descricao}</p>
                <div className="aurora-servico-meta">
                  <span
                    className={`aurora-servico-badge aurora-servico-badge--${srv.status}`}
                    aria-label={`Status: ${STATUS_SERVICO_LABEL[srv.status]}`}
                  >
                    {STATUS_SERVICO_LABEL[srv.status]}
                  </span>
                  <span className="aurora-servico-tempo">⏱ {srv.tempoMedioResposta}</span>
                  <span className="aurora-servico-canal">
                    {srv.canal === 'digital' ? '🌐 Digital' : srv.canal === 'presencial' ? '🏢 Presencial' : '🌐🏢 Digital e presencial'}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Contratos ── */}
      <section id="contratos" aria-labelledby="contratos-title" className="aurora-section">
        <h2 id="contratos-title" className="aurora-section-title">📋 Contratos Públicos</h2>
        <p className="aurora-section-sub">{CONTRATOS.length} contratos registrados</p>
        <div className="aurora-table-wrap" role="region" aria-label="Tabela de contratos">
          <table className="aurora-table">
            <thead>
              <tr>
                <th scope="col">Número</th>
                <th scope="col">Objeto</th>
                <th scope="col">Fornecedor</th>
                <th scope="col">Valor</th>
                <th scope="col">Vigência</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {CONTRATOS.map((ct) => (
                <tr key={ct.id}>
                  <td><code>{ct.numero}</code></td>
                  <td>{ct.objeto}</td>
                  <td>{ct.fornecedor}</td>
                  <td className="aurora-table-value">{formatBRL(ct.valor)}</td>
                  <td>
                    <time dateTime={ct.inicioVigencia}>{ct.inicioVigencia}</time>
                    {' → '}
                    <time dateTime={ct.fimVigencia}>{ct.fimVigencia}</time>
                  </td>
                  <td>
                    <span className={`aurora-contrato-status aurora-contrato-status--${ct.status}`}>
                      {ct.status === 'vigente' ? '● Vigente' : ct.status === 'encerrado' ? '○ Encerrado' : '⚠ Suspenso'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Obras ── */}
      <section aria-labelledby="obras-title" className="aurora-section">
        <h2 id="obras-title" className="aurora-section-title">🏗 Obras em Andamento</h2>
        <p className="aurora-section-sub">{OBRAS.length} obras cadastradas</p>
        <ul className="aurora-obras-list" role="list">
          {OBRAS.map((obra) => (
            <li key={obra.id} className="aurora-obra-item">
              <div className="aurora-obra-header">
                <span className="aurora-obra-icon" aria-hidden="true">{obra.icon}</span>
                <div>
                  <strong className="aurora-obra-nome">{obra.nome}</strong>
                  <span className="aurora-obra-bairro">📍 {obra.bairro}</span>
                </div>
                <span className={`aurora-obra-status aurora-obra-status--${obra.status}`}>
                  {STATUS_OBRA_LABEL[obra.status]}
                </span>
              </div>
              <p className="aurora-obra-desc">{obra.descricao}</p>
              <div className="aurora-obra-footer">
                <div
                  className="aurora-obra-progress"
                  role="progressbar"
                  aria-valuenow={obra.percentualConcluido}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${obra.percentualConcluido}% concluído`}
                >
                  <div
                    className="aurora-obra-progress-fill"
                    style={{width: `${obra.percentualConcluido}%`}}
                  />
                </div>
                <div className="aurora-obra-meta">
                  <span>{obra.percentualConcluido}% concluído</span>
                  <span>Previsão: <time dateTime={obra.previsaoTermino}>{obra.previsaoTermino}</time></span>
                  <span>{formatBRL(obra.valor)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Truth Trail CTA ── */}
      <section aria-label="Auditar Cidade Aurora" className="aurora-section aurora-audit-cta">
        <div className="card card-accented" data-accent="blue">
          <h2>🔍 Auditar Cidade Aurora</h2>
          <p>
            Use a Trilha da Verdade para verificar a integridade dos dados públicos de Cidade Aurora.
            Cada consulta gera um registro criptográfico auditável e rastreável.
          </p>
          <div className="aurora-audit-actions">
            <Link
              href="/trilha-da-verdade?uf=MG&cidade=Cidade+Aurora&correlationId=aurora-audit&traceId=aurora-audit-trace&layers=public_services%2Ccompliance%2Calerts"
              className="territory-cta territory-cta--ready"
            >
              <span className="territory-cta-icon" aria-hidden="true">▶</span>
              <span className="territory-cta-label">Iniciar auditoria</span>
              <span className="territory-cta-arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/verificacao-auditoria" className="aurora-audit-secondary">
              Ver trilha de auditoria →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Nota de conformidade ── */}
      <aside id="demo-section-conclusion" className="aurora-disclaimer" role="note" aria-label="Nota sobre dados demonstrativos">
        <p>
          <strong>⚠ Dados demonstrativos:</strong> Cidade Aurora é um ambiente fictício criado exclusivamente
          para demonstração do ecossistema EnvNeo. Todos os dados, nomes, valores e indicadores são simulados
          e não representam nenhum município real brasileiro.
        </p>
      </aside>

    </main>
  );
}
