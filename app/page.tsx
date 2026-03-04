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
        <Link href="/cidade-aurora" className="quicknav-item quicknav-item--aurora">
          <span className="quicknav-icon" aria-hidden="true">🌆</span>
          Smart City Demo
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

    </main>
  );
}
