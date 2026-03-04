import {getTranslations} from 'next-intl/server';

export default async function PrivacyPage() {
  const t = await getTranslations('privacyPage');

  return (
    <main id="conteudo-principal" role="main">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>

      <section className="card">
        <h2>{t('dataTitle')}</h2>
        <ul>
          <li>{t('data1')}</li>
          <li>{t('data2')}</li>
          <li>{t('data3')}</li>
        </ul>
      </section>

      <section className="card">
        <h2>{t('purposesTitle')}</h2>
        <ul>
          <li>{t('purpose1')}</li>
          <li>{t('purpose2')}</li>
          <li>{t('purpose3')}</li>
          <li>{t('purpose4')}</li>
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
        <h2>{t('rightsTitle')}</h2>
        <ul>
          <li>{t('right1')}</li>
          <li>{t('right2')}</li>
          <li>{t('right3')}</li>
          <li>{t('right4')}</li>
        </ul>
      </section>

      <section className="card">
        <h2>{t('contactTitle')}</h2>
        <p>{t('contactText')}</p>
      </section>
    </main>
  );
}
