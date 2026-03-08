import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import CitizenAgentTerritoryWrapper from '../components/CitizenAgentTerritoryWrapper';
import StandardQuickNav from '../components/StandardQuickNav';

type AgentMeta = {
  id: string;
  icon: string;
  accent: string;
};

const agents: AgentMeta[] = [
  {id: 'chief_editor_agent',        icon: '🎯', accent: 'amber'},
  {id: 'news_official_agent',       icon: '📰', accent: 'blue'},
  {id: 'citizen_services_agent',    icon: '🏛', accent: 'teal'},
  {id: 'transparency_agent',        icon: '📊', accent: 'violet'},
  {id: 'city_alerts_agent',         icon: '🚨', accent: 'red'},
  {id: 'social_distribution_agent', icon: '📡', accent: 'indigo'},
  {id: 'compliance_lgpd_agent',     icon: '⚖️', accent: 'slate'},
  {id: 'quality_accessibility_agent', icon: '♿', accent: 'green'},
];

export default async function AgentsGalleryPage() {
  const t = await getTranslations('agents');
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
          <span className="page-hero-icon" aria-hidden="true">🤖</span>
          {t('title')}
        </h1>
        <p>{t('description')}</p>
      </div>

      <section className="card" aria-labelledby="como-funciona-agentes">
        <h2 id="como-funciona-agentes">{t('howTitle')}</h2>
        <ul className="styled-list">
          <li>{t('how1')}</li>
          <li>{t('how2')}</li>
          <li>{t('how3')}</li>
        </ul>
      </section>

      <section className="agents-grid" aria-label={t('listLabel')}>
        {agents.map((agent) => (
          <article className="agent-card" data-accent={agent.accent} key={agent.id}>
            <span className="agent-card-icon" aria-hidden="true">{agent.icon}</span>
            <div className="agent-card-body">
              <h2>{t(`cards.${agent.id}.name`)}</h2>
              <p className="agent-card-area">{t(`cards.${agent.id}.area`)}</p>
              <p className="agent-card-role">{t(`cards.${agent.id}.role`)}</p>
            </div>
          </article>
        ))}
      </section>

      <CitizenAgentTerritoryWrapper />

      <StandardQuickNav current="agentes" />
    </main>
  );
}
