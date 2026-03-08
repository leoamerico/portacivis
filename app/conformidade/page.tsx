import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import ComplianceScorePanel from '../components/ComplianceScorePanel';
import StandardQuickNav from '../components/StandardQuickNav';

export default async function CompliancePage() {
  const t = await getTranslations('compliancePage');
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
          <span className="page-hero-icon" aria-hidden="true">✅</span>
          {t('title')}
        </h1>
        <p>{t('description')}</p>
      </div>

      <div className="two-col-grid">
        <section className="card card-accented" data-accent="teal" aria-labelledby="compliance-marcos">
          <h2 id="compliance-marcos">{t('milestonesTitle')}</h2>
          <ul className="styled-list">
            <li>{t('milestone1')}</li>
            <li>{t('milestone2')}</li>
            <li>{t('milestone3')}</li>
            <li>{t('milestone4')}</li>
          </ul>
        </section>

        <section className="card card-accented" data-accent="blue" aria-labelledby="compliance-controles">
          <h2 id="compliance-controles">{t('controlsTitle')}</h2>
          <ul className="styled-list">
            <li>{t('control1')}</li>
            <li>{t('control2')}</li>
            <li>{t('control3')}</li>
            <li>{t('control4')}</li>
          </ul>
        </section>
      </div>

      <section className="card card-accented" data-accent="violet" aria-labelledby="compliance-audit">
        <h2 id="compliance-audit">{t('auditVerificationTitle')}</h2>
        <p>{t('auditVerificationDescription')}</p>
        <Link href="/verificacao-auditoria" className="section-card-cta">
          {t('auditOpenLink')} <span aria-hidden="true">→</span>
        </Link>
      </section>

      <ComplianceScorePanel />

      <StandardQuickNav current="conformidade" />
    </main>
  );
}
