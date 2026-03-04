import {getTranslations} from 'next-intl/server';

export default async function TermsPage() {
  const t = await getTranslations('termsPage');

  return (
    <main id="conteudo-principal" role="main">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>

      <section className="card">
        <h2>{t('generalTitle')}</h2>
        <ul>
          <li>{t('general1')}</li>
          <li>{t('general2')}</li>
          <li>{t('general3')}</li>
        </ul>
      </section>

      <section className="card">
        <h2>{t('contentTitle')}</h2>
        <ul>
          <li>{t('content1')}</li>
          <li>{t('content2')}</li>
          <li>{t('content3')}</li>
        </ul>
      </section>

      <section className="card">
        <h2>{t('responsibilitiesTitle')}</h2>
        <ul>
          <li>{t('responsibility1')}</li>
          <li>{t('responsibility2')}</li>
          <li>{t('responsibility3')}</li>
        </ul>
      </section>
    </main>
  );
}
