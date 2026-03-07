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

      <section className="card" aria-labelledby="dpo-section-title">
        <h2 id="dpo-section-title">{t('dpoTitle')}</h2>
        <p>{t('dpoDescription')}</p>
        <p>
          <strong>{t('dpoEmailLabel')}:</strong>{' '}
          <a href="mailto:dpo@envneo.com.br">dpo@envneo.com.br</a>
        </p>
        <h3>{t('dpoRightsFormTitle')}</h3>
        <p>{t('dpoRightsFormDescription')}</p>
        <ul>
          <li>{t('dpoRight1')}</li>
          <li>{t('dpoRight2')}</li>
          <li>{t('dpoRight3')}</li>
          <li>{t('dpoRight4')}</li>
          <li>{t('dpoRight5')}</li>
          <li>{t('dpoRight6')}</li>
          <li>{t('dpoRight7')}</li>
          <li>{t('dpoRight8')}</li>
        </ul>
        <p>{t('dpoRightsFormInstructions')}</p>
        <p>
          <a href="mailto:dpo@envneo.com.br?subject=Exercício de Direitos LGPD — PortaCivis">
            {t('dpoRightsFormLink')}
          </a>
        </p>
        <p>{t('dpoSlaNote')}</p>
      </section>
    </main>
  );
}
