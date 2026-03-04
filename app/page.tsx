import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import InitialTerritorySelector from './components/InitialTerritorySelector';

export default async function HomePage() {
  const t = await getTranslations('home');
  const common = await getTranslations();
  const territory = await getTranslations('territory');

  return (
    <main id="conteudo-principal" role="main">

      {/* ── Quick-access strip ── */}
      <nav aria-label={t('quickAccessNav')} className="quicknav">
        <Link href="#mapa-brasil" className="quicknav-item">
          <span className="quicknav-icon" aria-hidden="true">🗺</span>
          {territory('mapTitle')}
        </Link>
        <Link href="/trilha-da-verdade" className="quicknav-item quicknav-item--highlight">
          <span className="quicknav-icon" aria-hidden="true">🔍</span>
          {common('truthTrail.title')}
        </Link>
        <Link href="/noticias" className="quicknav-item">
          <span className="quicknav-icon" aria-hidden="true">📰</span>
          {common('nav.news')}
        </Link>
        <Link href="/agentes" className="quicknav-item">
          <span className="quicknav-icon" aria-hidden="true">🤖</span>
          {common('nav.agents')}
        </Link>
        <Link href="/accessibilidade" className="quicknav-item">
          <span className="quicknav-icon" aria-hidden="true">♿</span>
          {common('nav.accessibility')}
        </Link>
        <Link href="/conformidade" className="quicknav-item">
          <span className="quicknav-icon" aria-hidden="true">✅</span>
          {common('nav.compliance')}
        </Link>
      </nav>

      {/* ── Hero ── */}
      <div className="page-hero">
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </div>

      {/* ── Territory map selector ── */}
      <section id="mapa-brasil" aria-label={territory('mapTitle')}>
        <InitialTerritorySelector />
      </section>

      {/* ── Section cards grid ── */}
      <section aria-label="Serviços e recursos do portal" className="section-grid">

        <article className="section-card" data-accent="amber" aria-label="Serviços ao cidadão">
          <span className="section-card-icon" aria-hidden="true">🏛</span>
          <div className="section-card-body">
            <h2>{t('sections.servicesTitle')}</h2>
            <p>{t('sections.servicesText')}</p>
          </div>
          <Link href="/noticias" className="section-card-cta" aria-label="Acessar serviços ao cidadão">
            Acessar serviços
            <span aria-hidden="true">→</span>
          </Link>
        </article>

        <article className="section-card" data-accent="blue" aria-label="Notícias oficiais">
          <span className="section-card-icon" aria-hidden="true">📰</span>
          <div className="section-card-body">
            <h2>{t('sections.newsTitle')}</h2>
            <p>{t('sections.newsText')}</p>
          </div>
          <Link href="/noticias" className="section-card-cta" aria-label="Ver notícias oficiais">
            Ver notícias
            <span aria-hidden="true">→</span>
          </Link>
        </article>

        <article className="section-card" data-accent="teal" aria-label="Transparência pública">
          <span className="section-card-icon" aria-hidden="true">📊</span>
          <div className="section-card-body">
            <h2>{t('sections.transparencyTitle')}</h2>
            <p>{t('sections.transparencyText')}</p>
          </div>
          <Link href="/conformidade" className="section-card-cta" aria-label="Ver dados de transparência">
            Ver transparência
            <span aria-hidden="true">→</span>
          </Link>
        </article>

        <article className="section-card" data-accent="violet" aria-labelledby="acessibilidade-titulo">
          <span className="section-card-icon" aria-hidden="true">♿</span>
          <div className="section-card-body">
            <h2 id="acessibilidade-titulo">{t('sections.accessibilityTitle')}</h2>
            <p>{t('sections.accessibilityText')}</p>
          </div>
          <Link href="/accessibilidade" className="section-card-cta" aria-label="Ver recursos de acessibilidade">
            Recursos de acesso
            <span aria-hidden="true">→</span>
          </Link>
        </article>

      </section>
    </main>
  );
}
