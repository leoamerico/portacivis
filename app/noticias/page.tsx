import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import {getPublishedArticles, type ArticleKind} from '../../src/news/articles';

const KIND_ACCENT: Record<ArticleKind, string> = {
  fato: 'blue',
  contexto: 'teal',
  analise: 'violet'
};

const KIND_ICON: Record<ArticleKind, string> = {
  fato: '📋',
  contexto: '🔎',
  analise: '💡'
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {day: '2-digit', month: 'long', year: 'numeric'}).format(
    new Date(iso + 'T12:00:00')
  );
}

export default async function NoticiasPage() {
  const t = await getTranslations('newsPage');
  const common = await getTranslations();
  const articles = getPublishedArticles();

  return (
    <main id="conteudo-principal" role="main">

      <div className="inner-breadcrumb">
        <Link href="/" className="inner-breadcrumb-back">← Início</Link>
        <span aria-hidden="true">/</span>
        <span>{t('title')}</span>
      </div>

      <div className="page-hero">
        <h1>
          <span className="page-hero-icon" aria-hidden="true">📰</span>
          {t('title')}
        </h1>
        <p>{t('description')}</p>
      </div>

      {/* ── Critérios de publicação ── */}
      <details className="card news-criteria-details">
        <summary className="news-criteria-summary">
          <span>{t('criteriaTitle')}</span>
        </summary>
        <ul className="styled-list">
          <li>{t('criteria1')}</li>
          <li>{t('criteria2')}</li>
          <li>{t('criteria3')}</li>
        </ul>
      </details>

      {/* ── Artigos ── */}
      <section aria-labelledby="noticias-publicacoes">
        <h2 id="noticias-publicacoes" className="news-section-heading">{t('articlesSectionTitle')}</h2>

        <ol className="news-list" role="list">
          {articles.map((article) => {
            const accent = KIND_ACCENT[article.kind];
            const icon = KIND_ICON[article.kind];
            const kindLabel =
              article.kind === 'fato'
                ? t('kindFato')
                : article.kind === 'contexto'
                  ? t('kindContexto')
                  : t('kindAnalise');

            return (
              <li key={article.id} className="news-card" data-accent={accent} aria-label={article.title}>

                <header className="news-card-header">
                  <div className="news-card-meta">
                    <span className={`news-kind-badge news-kind-badge--${article.kind}`} aria-label={`Tipo: ${kindLabel}`}>
                      <span aria-hidden="true">{icon}</span> {kindLabel}
                    </span>
                    {article.complianceReviewed && (
                      <span className="news-compliance-badge" title={t('complianceReviewedLabel')}>
                        ✓ {t('complianceReviewedLabel')}
                      </span>
                    )}
                  </div>
                  <time className="news-card-date" dateTime={article.publishedAt}>
                    {t('publishedLabel')}: {formatDate(article.publishedAt)}
                  </time>
                </header>

                <h3 className="news-card-title">{article.title}</h3>

                <p className="news-card-summary">{article.summary}</p>

                {article.context && (
                  <div className="news-card-context">
                    <p className="news-card-context-label">{t('contextLabel')}</p>
                    <p>{article.context}</p>
                  </div>
                )}

                {article.interpretation && (
                  <div className="news-card-interpretation">
                    <p className="news-card-interpretation-label">{t('interpretationLabel')}</p>
                    <p>{article.interpretation}</p>
                  </div>
                )}

                <footer className="news-card-footer">
                  <div className="news-card-tags" aria-label={t('tagsLabel')}>
                    {article.tags.map((tag) => (
                      <span key={tag} className="news-tag">{tag}</span>
                    ))}
                  </div>
                  <a
                    href={article.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-source-link"
                    aria-label={`${t('readSourceLabel')}: ${article.source.name}`}
                  >
                    <span>{t('sourceLabel')} {article.source.name}</span>
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </footer>

              </li>
            );
          })}
        </ol>
      </section>

      <nav className="quicknav" aria-label={t('relatedLinks')}>
        <Link href="/agentes" className="quicknav-item">
          <span className="quicknav-icon" aria-hidden="true">🤖</span>
          {common('nav.agents')}
        </Link>
        <Link href="/conformidade" className="quicknav-item">
          <span className="quicknav-icon" aria-hidden="true">✅</span>
          {common('nav.compliance')}
        </Link>
        <Link href="/verificacao-auditoria" className="quicknav-item">
          <span className="quicknav-icon" aria-hidden="true">🔗</span>
          Verificação de auditoria
        </Link>
      </nav>
    </main>
  );
}
