import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import TruthTrailAuditRecorder from '../components/TruthTrailAuditRecorder';
import ContextInsightPanel from '../components/ContextInsightPanel';
import ProvenanceSection from '../components/ProvenanceSection';
import {buildTruthTrailQuickPaths} from '../../src/truthTrail/pathRecommendations';

type SearchParams = Record<string, string | string[] | undefined>;

function pick(searchParams: SearchParams, key: string) {
  const value = searchParams[key];
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return value ?? '';
}

export default async function TrilhaDaVerdadePage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations('truthTrail');
  const common = await getTranslations();
  const params = await searchParams;

  const uf = pick(params, 'uf');
  const cidade = pick(params, 'cidade');
  const correlationId = pick(params, 'correlationId');
  const traceId = pick(params, 'traceId');
  const layersRaw = pick(params, 'layers');
  const selectedLayers = layersRaw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const hasTerritory = uf.trim().length > 0 && cidade.trim().length > 0;
  const quickPaths = buildTruthTrailQuickPaths({hasTerritory, uf, cidade});

  return (
    <main id="conteudo-principal" role="main">

      <div className="inner-breadcrumb">
        <Link href="/" className="inner-breadcrumb-back">← Início</Link>
        <span aria-hidden="true">/</span>
        <span>{t('title')}</span>
      </div>

      <div className="page-hero">
        <h1>
          <span className="page-hero-icon" aria-hidden="true">🔍</span>
          {t('title')}
        </h1>
        <p>{t('description')}</p>
      </div>

      <section className="card" aria-labelledby="trilha-boas-vindas">
        <h2 id="trilha-boas-vindas">{t('welcomeTitle')}</h2>
        <p>
          {hasTerritory
            ? t('welcomeCity', {cidade, uf})
            : t('welcomeGeneric')}
        </p>
        <p>{t('welcomeGuide')}</p>
      </section>

      <section className="card" aria-labelledby="trilha-contexto">
        <h2 id="trilha-contexto">{t('contextTitle')}</h2>
        {hasTerritory ? (
          <ul>
            <li>{t('territory', {cidade, uf})}</li>
            <li>{t('classification')}</li>
            <li>{t('contextLayers', {count: selectedLayers.length})}</li>
          </ul>
        ) : (
          <p>{t('missingTerritory')}</p>
        )}
      </section>

      <section className="card" aria-labelledby="trilha-governanca">
        <h2 id="trilha-governanca">{t('governanceTitle')}</h2>
        <ul>
          <li>{t('governance1')}</li>
          <li>{t('governance2')}</li>
          <li>{t('governance3')}</li>
          <li>{t('governance4')}</li>
        </ul>
      </section>

      <ContextInsightPanel
        uf={uf}
        cidade={cidade}
        traceId={traceId}
        correlationId={correlationId}
        layers={selectedLayers}
      />

      <ProvenanceSection hasTerritory={hasTerritory} cidade={cidade} uf={uf} layers={selectedLayers} />

      <TruthTrailAuditRecorder
        uf={uf}
        cidade={cidade}
        correlationId={correlationId || 'N/A'}
        traceId={traceId || 'N/A'}
        classification="publico"
      />

      <nav className="card" aria-label={t('nextActions')}>
        <h2>{t('quickPathsTitle')}</h2>
        <p>{t('quickPathsDescription')}</p>
        <ol className="quickpaths-list">
          {quickPaths.map((path) => (
            <li key={path.id} className="quickpaths-item">
              <Link href={path.href} className="quickpaths-link">
                <span className="quickpaths-label">
                  {t(`quickPaths.${path.id}.label`)}
                  {path.recommended && <span className="quickpaths-badge">{t('recommended')}</span>}
                </span>
                <span className="quickpaths-desc">{t(`quickPaths.${path.id}.description`)}</span>
              </Link>
            </li>
          ))}
        </ol>
        <nav className="quicknav" aria-label="Navegação rápida">
          <Link href={hasTerritory ? `/noticias?uf=${encodeURIComponent(uf)}&cidade=${encodeURIComponent(cidade)}` : '/noticias'} className="quicknav-item">
            <span className="quicknav-icon" aria-hidden="true">📰</span>
            {common('nav.news')}
          </Link>
          <Link href="/agentes" className="quicknav-item">
            <span className="quicknav-icon" aria-hidden="true">🤖</span>
            {common('nav.agents')}
          </Link>
          <Link href="/conformidade" className="quicknav-item">
            <span className="quicknav-icon" aria-hidden="true">✅</span>
            {common('nav.compliance')}
          </Link>
          <Link href="/verificacao-auditoria" className="quicknav-item">
            <span className="quicknav-icon" aria-hidden="true">🔗</span>
            {t('verifyAudit')}
          </Link>
          <Link href="/cidade-aurora" className="quicknav-item quicknav-item--aurora">
            <span className="quicknav-icon" aria-hidden="true">🌆</span>
            Cidade Aurora
          </Link>
          <Link href="/" className="quicknav-item quicknav-item--highlight">
            <span className="quicknav-icon" aria-hidden="true">🏠</span>
            {t('restart')}
          </Link>
        </nav>
      </nav>
    </main>
  );
}
