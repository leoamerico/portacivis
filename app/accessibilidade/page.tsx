import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

export default async function AccessibilityPage() {
  const t = await getTranslations('accessibilityPage');

  return (
    <main id="conteudo-principal" role="main">

      <div className="inner-breadcrumb">
        <Link href="/" className="inner-breadcrumb-back">← Início</Link>
        <span aria-hidden="true">/</span>
        <span>{t('title')}</span>
      </div>

      <div className="page-hero">
        <h1>
          <span className="page-hero-icon" aria-hidden="true">♿</span>
          {t('title')}
        </h1>
        <p>{t('description')}</p>
      </div>

      <div className="two-col-grid">
        <section className="card card-accented" data-accent="blue" aria-labelledby="surdez">
          <h2 id="surdez">{t('deafTitle')}</h2>
          <ul className="styled-list">
            <li>{t('deaf1')}</li>
            <li>{t('deaf2')}</li>
            <li>{t('deaf3')}</li>
          </ul>
        </section>

        <section className="card card-accented" data-accent="violet" aria-labelledby="baixa-visao">
          <h2 id="baixa-visao">{t('lowVisionTitle')}</h2>
          <ul className="styled-list">
            <li>{t('lowVision1')}</li>
            <li>{t('lowVision2')}</li>
            <li>{t('lowVision3')}</li>
          </ul>
        </section>

        <section className="card card-accented" data-accent="amber" aria-labelledby="daltonismo">
          <h2 id="daltonismo">{t('colorBlindTitle')}</h2>
          <ul className="styled-list">
            <li>{t('colorBlind1')}</li>
            <li>{t('colorBlind2')}</li>
            <li>{t('colorBlind3')}</li>
          </ul>
        </section>

        <section className="card card-accented" data-accent="teal" aria-labelledby="mobilidade-cognicao">
          <h2 id="mobilidade-cognicao">{t('mobilityTitle')}</h2>
          <ul className="styled-list">
            <li>{t('mobility1')}</li>
            <li>{t('mobility2')}</li>
            <li>{t('mobility3')}</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
