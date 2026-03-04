import {getTranslations} from 'next-intl/server';

export default async function AccessibilityPage() {
  const t = await getTranslations('accessibilityPage');

  return (
    <main id="conteudo-principal" role="main">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>

      <section className="card" aria-labelledby="surdez">
        <h2 id="surdez">{t('deafTitle')}</h2>
        <ul>
          <li>{t('deaf1')}</li>
          <li>{t('deaf2')}</li>
          <li>{t('deaf3')}</li>
        </ul>
      </section>

      <section className="card" aria-labelledby="baixa-visao">
        <h2 id="baixa-visao">{t('lowVisionTitle')}</h2>
        <ul>
          <li>{t('lowVision1')}</li>
          <li>{t('lowVision2')}</li>
          <li>{t('lowVision3')}</li>
        </ul>
      </section>

      <section className="card" aria-labelledby="daltonismo">
        <h2 id="daltonismo">{t('colorBlindTitle')}</h2>
        <ul>
          <li>{t('colorBlind1')}</li>
          <li>{t('colorBlind2')}</li>
          <li>{t('colorBlind3')}</li>
        </ul>
      </section>

      <section className="card" aria-labelledby="mobilidade-cognicao">
        <h2 id="mobilidade-cognicao">{t('mobilityTitle')}</h2>
        <ul>
          <li>{t('mobility1')}</li>
          <li>{t('mobility2')}</li>
          <li>{t('mobility3')}</li>
        </ul>
      </section>
    </main>
  );
}
