import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

export default async function NoticiasPage() {
  const t = await getTranslations('newsPage');
  const common = await getTranslations();

  return (
    <main id="conteudo-principal" role="main">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>

      <section className="card" aria-labelledby="noticias-destaques">
        <h2 id="noticias-destaques">{t('highlightsTitle')}</h2>
        <p>{t('highlightsText')}</p>
      </section>

      <section className="card" aria-labelledby="noticias-fontes">
        <h2 id="noticias-fontes">{t('criteriaTitle')}</h2>
        <ul>
          <li>{t('criteria1')}</li>
          <li>{t('criteria2')}</li>
          <li>{t('criteria3')}</li>
        </ul>
      </section>

      <nav className="card" aria-label={t('relatedLinks')}>
        <div className="quick-links">
          <Link href="/agentes">{common('nav.agents')}</Link>
          <Link href="/conformidade">{common('nav.compliance')}</Link>
          <Link href="/privacidade">{common('nav.privacy')}</Link>
        </div>
      </nav>
    </main>
  );
}
