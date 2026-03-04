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

      <div className="page-hero">
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </div>

      <section id="mapa-brasil" aria-label={territory('mapTitle')}>
        <InitialTerritorySelector />
      </section>

      <section className="card card-interactive">
        <h2>{t('sections.servicesTitle')}</h2>
        <p>{t('sections.servicesText')}</p>
        <Link href="/noticias" className="card-cta" aria-label="Acessar serviços ao cidadão">
          Acessar serviços →
        </Link>
      </section>

      <section className="card card-interactive">
        <h2>{t('sections.newsTitle')}</h2>
        <p>{t('sections.newsText')}</p>
        <Link href="/noticias" className="card-cta" aria-label="Ver notícias oficiais">
          Ver notícias →
        </Link>
      </section>

      <section className="card card-interactive">
        <h2>{t('sections.transparencyTitle')}</h2>
        <p>{t('sections.transparencyText')}</p>
        <Link href="/conformidade" className="card-cta" aria-label="Ver dados de transparência">
          Ver transparência →
        </Link>
      </section>

      <section className="card card-interactive" aria-labelledby="acessibilidade-titulo">
        <h2 id="acessibilidade-titulo">{t('sections.accessibilityTitle')}</h2>
        <p>{t('sections.accessibilityText')}</p>
        <Link href="/accessibilidade" className="card-cta" aria-label="Ver recursos de acessibilidade">
          Recursos de acessibilidade →
        </Link>
      </section>
    </main>
  );
}
