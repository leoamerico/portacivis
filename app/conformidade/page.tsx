import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

export default async function CompliancePage() {
  const t = await getTranslations('compliancePage');

  return (
    <main id="conteudo-principal" role="main">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>

      <section className="card">
        <h2>{t('milestonesTitle')}</h2>
        <ul>
          <li>{t('milestone1')}</li>
          <li>{t('milestone2')}</li>
          <li>{t('milestone3')}</li>
          <li>{t('milestone4')}</li>
        </ul>
      </section>

      <section className="card">
        <h2>{t('controlsTitle')}</h2>
        <ul>
          <li>{t('control1')}</li>
          <li>{t('control2')}</li>
          <li>{t('control3')}</li>
          <li>{t('control4')}</li>
        </ul>
      </section>

      <section className="card">
        <h2>{t('auditVerificationTitle')}</h2>
        <p>{t('auditVerificationDescription')}</p>
        <p>
          <Link href="/verificacao-auditoria">{t('auditOpenLink')}</Link>
        </p>
      </section>
    </main>
  );
}
