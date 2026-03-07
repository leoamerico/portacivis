import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import SubjectRightsPanel from './SubjectRightsPanel';

export async function generateMetadata() {
  const t = await getTranslations('meusDados');
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function MeusDadosPage() {
  const t = await getTranslations('meusDados');

  const labels = {
    rightsTitle: t('rightsTitle'),
    rightsDescription: t('rightsDescription'),
    rights: {
      access: {
        title: t('rights.access.title'),
        description: t('rights.access.description'),
        button: t('rights.access.button'),
        article: t('rights.access.article')
      },
      rectify: {
        title: t('rights.rectify.title'),
        description: t('rights.rectify.description'),
        button: t('rights.rectify.button'),
        article: t('rights.rectify.article')
      },
      anonymize: {
        title: t('rights.anonymize.title'),
        description: t('rights.anonymize.description'),
        button: t('rights.anonymize.button'),
        article: t('rights.anonymize.article')
      },
      portability: {
        title: t('rights.portability.title'),
        description: t('rights.portability.description'),
        button: t('rights.portability.button'),
        article: t('rights.portability.article')
      },
      delete: {
        title: t('rights.delete.title'),
        description: t('rights.delete.description'),
        button: t('rights.delete.button'),
        article: t('rights.delete.article')
      },
      consent: {
        title: t('rights.consent.title'),
        description: t('rights.consent.description'),
        button: t('rights.consent.button'),
        article: t('rights.consent.article')
      },
      oppose: {
        title: t('rights.oppose.title'),
        description: t('rights.oppose.description'),
        button: t('rights.oppose.button'),
        article: t('rights.oppose.article')
      }
    },
    submitSuccess: t('submitSuccess'),
    submitError: t('submitError'),
    requestId: t('requestId'),
    deadline: t('deadline'),
    statusPending: t('statusPending'),
    statusInProgress: t('statusInProgress'),
    statusCompleted: t('statusCompleted'),
    statusRejected: t('statusRejected'),
    dpoNotified: t('dpoNotified'),
    requestsTitle: t('requestsTitle'),
    noRequests: t('noRequests'),
    loadingRequests: t('loadingRequests'),
    requestsError: t('requestsError'),
    refreshRequests: t('refreshRequests'),
    legalNotice: t('legalNotice'),
    dpoContact: t('dpoContact'),
    sessionLabel: t('sessionLabel'),
    sessionHint: t('sessionHint')
  };

  return (
    <main id="conteudo-principal" role="main">
      <div className="inner-breadcrumb">
        <Link href="/" className="inner-breadcrumb-back">← {t('breadcrumbHome')}</Link>
        <span aria-hidden="true">/</span>
        <span>{t('breadcrumbCurrent')}</span>
      </div>

      <div className="page-hero">
        <h1>
          <span className="page-hero-icon" aria-hidden="true">🔐</span>
          {t('title')}
        </h1>
        <p>{t('description')}</p>
      </div>

      <SubjectRightsPanel labels={labels} />
    </main>
  );
}
