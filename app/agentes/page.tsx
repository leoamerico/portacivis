type AgentCard = {
  id: string;
  area: string;
  role: string;
};

const agents: AgentCard[] = [
  {
    id: 'chief_editor_agent',
    area: 'Coordenação Editorial',
    role: 'Prioriza pautas, organiza o fluxo e aprova publicação final.',
  },
  {
    id: 'news_official_agent',
    area: 'Notícias Oficiais',
    role: 'Consolida fontes oficiais e redige a primeira versão da notícia.',
  },
  {
    id: 'citizen_services_agent',
    area: 'Serviços ao Cidadão',
    role: 'Traduz conteúdo técnico para linguagem prática de serviço público.',
  },
  {
    id: 'transparency_agent',
    area: 'Transparência',
    role: 'Valida dados públicos e garante rastreabilidade da informação.',
  },
  {
    id: 'city_alerts_agent',
    area: 'Alertas',
    role: 'Organiza comunicados urgentes com clareza e prioridade pública.',
  },
  {
    id: 'social_distribution_agent',
    area: 'Distribuição',
    role: 'Adapta o conteúdo para canais de difusão sem perder sentido original.',
  },
  {
    id: 'compliance_lgpd_agent',
    area: 'Compliance e LGPD',
    role: 'Bloqueia risco legal, revisa privacidade e integridade institucional.',
  },
  {
    id: 'quality_accessibility_agent',
    area: 'Qualidade e Acessibilidade',
    role: 'Assegura legibilidade, inclusão e padrão de acessibilidade digital.',
  },
];

export default function AgentsGalleryPage() {
  return (
    <main id="conteudo-principal" role="main">
      <h1>Galeria de Agentes do PortaCivis</h1>
      <p>
        Estes são agentes de inteligência que agregam, checam e apresentam notícias verificadas em
        uma nova roupagem, com linguagem cidadã, rastreabilidade de fontes e revisão de conformidade.
      </p>

      <section className="card" aria-labelledby="como-funciona-agentes">
        <h2 id="como-funciona-agentes">Como eles atuam</h2>
        <ul>
          <li>Coletam e organizam informações de fontes oficiais verificáveis.</li>
          <li>Checam consistência editorial, legal, ética e de acessibilidade.</li>
          <li>Publicam conteúdo em formato mais claro para o cidadão.</li>
        </ul>
      </section>

      <section className="agents-grid" aria-label="Lista de agentes">
        {agents.map((agent) => (
          <article className="card" key={agent.id}>
            <h2>{agent.id}</h2>
            <p>
              <strong>Área:</strong> {agent.area}
            </p>
            <p>{agent.role}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
