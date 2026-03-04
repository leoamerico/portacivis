import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import TruthTrailVerificationPanel from '../components/TruthTrailVerificationPanel';

export default async function VerificacaoAuditoriaPage() {
  const t = await getTranslations('compliancePage');

  return (
    <main id="conteudo-principal" role="main">
      <h1>{t('auditVerificationTitle')}</h1>
      <p>{t('auditVerificationDescription')}</p>

      <TruthTrailVerificationPanel
        labels={{
          loading: t('auditLoading'),
          status: t('auditStatusLabel'),
          healthy: t('auditStatusHealthy'),
          broken: t('auditStatusBroken'),
          chainLength: t('auditChainLength'),
          headHash: t('auditHeadHash'),
          issuesTitle: t('auditIssuesTitle'),
          noIssues: t('auditNoIssues'),
          refresh: t('auditRefresh'),
          requestError: t('auditRequestError')
        }}
      />

      <nav className="quicknav" aria-label={t('auditNavigation')}>
        <Link href="/trilha-da-verdade" className="quicknav-item">
          <span className="quicknav-icon" aria-hidden="true">🔍</span>
          {t('auditBackTrail')}
        </Link>
        <Link href="/conformidade" className="quicknav-item">
          <span className="quicknav-icon" aria-hidden="true">✅</span>
          {t('auditBackCompliance')}
        </Link>
        <Link href="/cidade-aurora" className="quicknav-item quicknav-item--aurora">
          <span className="quicknav-icon" aria-hidden="true">🌆</span>
          Cidade Aurora
        </Link>
        <Link href="/" className="quicknav-item quicknav-item--highlight">
          <span className="quicknav-icon" aria-hidden="true">🏠</span>
          Voltar ao Início
        </Link>
      </nav>
    </main>
  );
}
