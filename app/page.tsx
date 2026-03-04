import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import InitialTerritorySelector from './components/InitialTerritorySelector';

export default async function HomePage() {
  const t = await getTranslations('home');
  const common = await getTranslations();
  const territory = await getTranslations('territory');

  return (
    <main id="conteudo-principal" role="main">
      <nav aria-label={t('quickAccessNav')} className="card">
        <div className="quick-links">
          <Link href="#mapa-brasil">{territory('mapTitle')}</Link>
          <Link href="/trilha-da-verdade">{common('truthTrail.title')}</Link>
          <Link href="/noticias">{common('nav.news')}</Link>
          <Link href="/agentes">{common('nav.agents')}</Link>
          <Link href="/accessibilidade">{common('nav.accessibility')}</Link>
          <Link href="/conformidade">{common('nav.compliance')}</Link>
        </div>
      </nav>

      <h1>{t('title')}</h1>
      <p>{t('description')}</p>

      <section id="mapa-brasil" aria-label={territory('mapTitle')}>
        <InitialTerritorySelector />
      </section>

      <section className="card">
        <h2>{t('sections.servicesTitle')}</h2>
        <p>{t('sections.servicesText')}</p>
      </section>

      <section className="card">
        <h2>{t('sections.newsTitle')}</h2>
        <p>{t('sections.newsText')}</p>
      </section>

      <section className="card">
        <h2>{t('sections.transparencyTitle')}</h2>
        <p>{t('sections.transparencyText')}</p>
      </section>

      <section className="card" aria-labelledby="acessibilidade-titulo">
        <h2 id="acessibilidade-titulo">{t('sections.accessibilityTitle')}</h2>
        <p>{t('sections.accessibilityText')}</p>
      </section>
    </main>
  );
}
