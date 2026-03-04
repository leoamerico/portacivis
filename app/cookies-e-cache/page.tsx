import {getTranslations} from 'next-intl/server';

export default async function CookiesCachePolicyPage() {
  const t = await getTranslations('cookiesPage');

  return (
    <main id="conteudo-principal" role="main">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>

      <section className="card">
        <h2>{t('typesTitle')}</h2>
        <ul>
          <li>{t('type1')}</li>
          <li>{t('type2')}</li>
          <li>{t('type3')}</li>
        </ul>
      </section>

      <section className="card">
        <h2>{t('limitsTitle')}</h2>
        <ul>
          <li>{t('limit1')}</li>
          <li>{t('limit2')}</li>
          <li>{t('limit3')}</li>
        </ul>
      </section>

      <section className="card">
        <h2>{t('legalTitle')}</h2>
        <ul>
          <li>{t('legal1')}</li>
          <li>{t('legal2')}</li>
          <li>{t('legal3')}</li>
        </ul>
      </section>
    </main>
  );
}
