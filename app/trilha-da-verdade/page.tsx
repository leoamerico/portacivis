import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import TruthTrailAuditRecorder from '../components/TruthTrailAuditRecorder';

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
  const hasTerritory = uf.trim().length > 0 && cidade.trim().length > 0;

  return (
    <main id="conteudo-principal" role="main">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>

      <section className="card" aria-labelledby="trilha-contexto">
        <h2 id="trilha-contexto">{t('contextTitle')}</h2>
        {hasTerritory ? (
          <ul>
            <li>{t('territory', {cidade, uf})}</li>
            <li>{t('correlationId', {value: correlationId || '-'})}</li>
            <li>{t('traceId', {value: traceId || '-'})}</li>
            <li>{t('classification')}</li>
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

      <TruthTrailAuditRecorder
        uf={uf}
        cidade={cidade}
        correlationId={correlationId || 'N/A'}
        traceId={traceId || 'N/A'}
        classification="publico"
      />

      <nav className="card" aria-label={t('nextActions')}>
        <div className="quick-links">
          <Link href={hasTerritory ? `/noticias?uf=${encodeURIComponent(uf)}&cidade=${encodeURIComponent(cidade)}` : '/noticias'}>
            {common('nav.news')}
          </Link>
          <Link href="/agentes">{common('nav.agents')}</Link>
          <Link href="/conformidade">{common('nav.compliance')}</Link>
          <Link href="/verificacao-auditoria">{t('verifyAudit')}</Link>
          <Link href="/">{t('restart')}</Link>
        </div>
      </nav>
    </main>
  );
}
