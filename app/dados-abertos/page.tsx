import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

export default async function DadosAbertosPage() {
  const t = await getTranslations('dadosAbertosPage');

  const datasets = [
    {
      id: 'servicos',
      titleKey: 'dataset1Title' as const,
      descriptionKey: 'dataset1Description' as const,
      updated: '2026-03-07',
      formats: ['JSON'],
      downloadUrl: '/dados-abertos/servicos.json',
      licenseUrl: 'http://opendefinition.org/licenses/cc-by/',
      licenseKey: 'licenseCC' as const
    },
    {
      id: 'catalog',
      titleKey: 'dataset2Title' as const,
      descriptionKey: 'dataset2Description' as const,
      updated: '2026-03-07',
      formats: ['JSON'],
      downloadUrl: '/dados-abertos/catalog.json',
      licenseUrl: 'http://opendefinition.org/licenses/cc-by/',
      licenseKey: 'licenseCC' as const
    }
  ];

  return (
    <main id="conteudo-principal" role="main">

      <div className="inner-breadcrumb">
        <Link href="/" className="inner-breadcrumb-back">← {t('breadcrumbHome')}</Link>
        <span aria-hidden="true">/</span>
        <span>{t('title')}</span>
      </div>

      <div className="page-hero">
        <h1>
          <span className="page-hero-icon" aria-hidden="true">📂</span>
          {t('title')}
        </h1>
        <p>{t('description')}</p>
        <span className="badge-open-data" aria-label={t('openDataBadgeAria')}>
          {t('openDataBadge')}
        </span>
      </div>

      <section className="card card-accented" data-accent="teal" aria-labelledby="datasets-section">
        <h2 id="datasets-section">{t('datasetsTitle')}</h2>
        <div className="datasets-grid">
          {datasets.map((ds) => (
            <article key={ds.id} className="dataset-card" aria-labelledby={`ds-${ds.id}-title`}>
              <h3 id={`ds-${ds.id}-title`}>{t(ds.titleKey)}</h3>
              <p>{t(ds.descriptionKey)}</p>
              <dl className="dataset-meta">
                <dt>{t('metaUpdated')}</dt>
                <dd>
                  <time dateTime={ds.updated}>{ds.updated}</time>
                </dd>
                <dt>{t('metaFormats')}</dt>
                <dd>{ds.formats.join(', ')}</dd>
                <dt>{t('metaLicense')}</dt>
                <dd>
                  <a href={ds.licenseUrl} target="_blank" rel="noopener noreferrer">
                    {t(ds.licenseKey)}
                  </a>
                </dd>
              </dl>
              <div className="dataset-actions">
                <a
                  href={ds.downloadUrl}
                  className="section-card-cta"
                  download
                  aria-label={`${t('downloadJson')} — ${t(ds.titleKey)}`}
                >
                  {t('downloadJson')} <span aria-hidden="true">↓</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card card-accented" data-accent="blue" aria-labelledby="api-section">
        <h2 id="api-section">{t('apiTitle')}</h2>
        <p>{t('apiDescription')}</p>
        <div className="two-col-grid">
          <div>
            <h3>{t('endpointCatalogTitle')}</h3>
            <code className="code-block">GET /api/v1/dados-abertos/catalog</code>
            <p>{t('endpointCatalogDescription')}</p>
          </div>
          <div>
            <h3>{t('endpointDocsTitle')}</h3>
            <p>{t('endpointDocsDescription')}</p>
            <Link href="/api/docs" className="section-card-cta">
              {t('openApiDocs')} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="card card-accented" data-accent="violet" aria-labelledby="usage-section">
        <h2 id="usage-section">{t('usageTitle')}</h2>
        <p>{t('usageDescription')}</p>
        <pre className="code-block" aria-label={t('usageExampleAria')}>
          <code>{`curl -H "Accept: application/json" \\
  https://www.portacivis.com.br/api/v1/dados-abertos/catalog`}</code>
        </pre>
      </section>

      <section className="card" aria-labelledby="license-section">
        <h2 id="license-section">{t('licenseTitle')}</h2>
        <p>{t('licenseDescription')}</p>
        <a
          href="http://opendefinition.org/licenses/cc-by/"
          target="_blank"
          rel="noopener noreferrer"
          className="section-card-cta"
        >
          Creative Commons Attribution 4.0 <span aria-hidden="true">→</span>
        </a>
      </section>

    </main>
  );
}
