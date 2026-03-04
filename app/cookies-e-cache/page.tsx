export default function CookiesCachePolicyPage() {
  return (
    <main id="conteudo-principal" role="main">
      <h1>Política de Cookies e Cache</h1>
      <p>
        O PortaCivis utiliza cookies e armazenamento local apenas no nível necessário para segurança,
        acessibilidade e continuidade de navegação, com controles de consentimento para pesquisa de
        uso anônima.
      </p>

      <section className="card">
        <h2>Tipos de dados armazenados</h2>
        <ul>
          <li>Essenciais: preferências técnicas, segurança e sessão de navegação.</li>
          <li>Acessibilidade: contraste, tamanho de fonte, redução de movimento e leitura.</li>
          <li>
            Pesquisa anônima (opcional): métricas agregadas de uso, sem identificação pessoal direta
            ou indireta.
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>Limites de tratamento</h2>
        <ul>
          <li>É vedado perfilamento sensível por raça, religião, saúde, orientação ou ideologia.</li>
          <li>É vedado cruzamento de dados para reidentificação de visitantes.</li>
          <li>É vedado uso de cookies para finalidade incompatível com interesse público.</li>
        </ul>
      </section>

      <section className="card">
        <h2>Base legal e proteção</h2>
        <ul>
          <li>Base legal: interesse público, segurança e conformidade regulatória aplicável.</li>
          <li>Minimização: somente dados necessários para a finalidade declarada.</li>
          <li>Retenção: prazo limitado e proporcional, com descarte seguro.</li>
        </ul>
      </section>
    </main>
  );
}
