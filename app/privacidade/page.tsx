export default function PrivacyPage() {
  return (
    <main id="conteudo-principal" role="main">
      <h1>Política de Privacidade e Proteção de Dados (LGPD)</h1>
      <p>
        O PortaCivis trata dados pessoais de forma mínima e proporcional, em conformidade com a Lei
        Geral de Proteção de Dados (Lei nº 13.709/2018), para atender interesse público e garantir
        segurança do serviço.
      </p>

      <section className="card">
        <h2>Quais dados podem ser tratados</h2>
        <ul>
          <li>Dados de navegação técnica para segurança e integridade do portal.</li>
          <li>Registros de acesso estritamente necessários para prevenção de fraudes e auditoria.</li>
          <li>Dados fornecidos voluntariamente pelo cidadão em canais oficiais de atendimento.</li>
        </ul>
      </section>

      <section className="card">
        <h2>Finalidades</h2>
        <ul>
          <li>Disponibilizar serviços e informações públicas.</li>
          <li>Garantir funcionamento, disponibilidade e segurança da plataforma.</li>
          <li>Atender obrigações legais e regulatórias aplicáveis.</li>
          <li>
            Realizar pesquisa de uso anônima e agregada (opcional), exclusivamente para melhoria de
            serviço público digital.
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>Limites éticos de pesquisa de visitantes</h2>
        <ul>
          <li>Não realizamos perfilamento sensível de visitantes.</li>
          <li>Não realizamos reidentificação a partir de cache, cookies ou telemetria.</li>
          <li>Coleta opcional para pesquisa de uso é agregada, minimizada e auditável.</li>
        </ul>
      </section>

      <section className="card">
        <h2>Direitos do titular</h2>
        <ul>
          <li>Confirmação da existência de tratamento.</li>
          <li>Acesso e correção de dados quando aplicável.</li>
          <li>Informação sobre compartilhamentos, base legal e retenção.</li>
          <li>Solicitação de revisão de decisões automatizadas, quando houver.</li>
        </ul>
      </section>

      <section className="card">
        <h2>Contato para privacidade</h2>
        <p>
          Para solicitações de dados e privacidade, utilize os canais oficiais divulgados na página de
          atendimento institucional do município.
        </p>
      </section>
    </main>
  );
}
