import {getTranslations} from 'next-intl/server';

type AgentCard = {
  id: string;
};

const agents: AgentCard[] = [
  {id: 'chief_editor_agent'},
  {id: 'news_official_agent'},
  {id: 'citizen_services_agent'},
  {id: 'transparency_agent'},
  {id: 'city_alerts_agent'},
  {id: 'social_distribution_agent'},
  {id: 'compliance_lgpd_agent'},
  {id: 'quality_accessibility_agent'},
];

export default async function AgentsGalleryPage() {
  const t = await getTranslations('agents');

  return (
    <main id="conteudo-principal" role="main">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>

      <section className="card" aria-labelledby="como-funciona-agentes">
        <h2 id="como-funciona-agentes">{t('howTitle')}</h2>
        <ul>
          <li>{t('how1')}</li>
          <li>{t('how2')}</li>
          <li>{t('how3')}</li>
        </ul>
      </section>

      <section className="agents-grid" aria-label={t('listLabel')}>
        {agents.map((agent) => (
          <article className="card" key={agent.id}>
            <h2>{t(`cards.${agent.id}.name`)}</h2>
            <p>
              <strong>{t('area')}:</strong> {t(`cards.${agent.id}.area`)}
            </p>
            <p>{t(`cards.${agent.id}.role`)}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
