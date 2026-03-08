import {getTranslations} from 'next-intl/server';
import TruthTrailVerificationPanel from '../components/TruthTrailVerificationPanel';
import StandardQuickNav from '../components/StandardQuickNav';

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

      <StandardQuickNav current="verificacao" />
    </main>
  );
}
