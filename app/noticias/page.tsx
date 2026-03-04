import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

export default async function NoticiasPage() {
  const t = await getTranslations('newsPage');
  const common = await getTranslations();

  return (
    <main id="conteudo-principal" role="main">

      <div className="inner-breadcrumb">
        <Link href="/" className="inner-breadcrumb-back">← Início</Link>
        <span aria-hidden="true">/</span>
        <span>{t('title')}</span>
      </div>

      <div className="page-hero">
        <h1>
          <span className="page-hero-icon" aria-hidden="true">📰</span>
          {t('title')}
        </h1>
        <p>{t('description')}</p>
      </div>

      <section className="card card-accented" data-accent="blue" aria-labelledby="noticias-destaques">
        <h2 id="noticias-destaques">{t('highlightsTitle')}</h2>
        <p>{t('highlightsText')}</p>
      </section>

      <section className="card" aria-labelledby="noticias-fontes">
        <h2 id="noticias-fontes">{t('criteriaTitle')}</h2>
        <ul className="styled-list">
          <li>{t('criteria1')}</li>
          <li>{t('criteria2')}</li>
          <li>{t('criteria3')}</li>
        </ul>
      </section>

      <nav className="quicknav" aria-label={t('relatedLinks')}>
        <Link href="/agentes" className="quicknav-item">
          <span className="quicknav-icon" aria-hidden="true">🤖</span>
          {common('nav.agents')}
        </Link>
        <Link href="/conformidade" className="quicknav-item">
          <span className="quicknav-icon" aria-hidden="true">✅</span>
          {common('nav.compliance')}
        </Link>
        <Link href="/privacidade" className="quicknav-item">
          <span className="quicknav-icon" aria-hidden="true">🔒</span>
          {common('nav.privacy')}
        </Link>
      </nav>
    </main>
  );
}
