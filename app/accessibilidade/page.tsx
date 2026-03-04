export default function AccessibilityPage() {
  return (
    <main id="conteudo-principal" role="main">
      <h1>Recursos de Acessibilidade</h1>
      <p>
        Este portal segue práticas de acessibilidade digital para ampliar o acesso de pessoas com
        deficiência auditiva, baixa visão e outras necessidades de navegação assistida.
      </p>

      <section className="card" aria-labelledby="surdez">
        <h2 id="surdez">Pessoas com surdez</h2>
        <ul>
          <li>Conteúdo textual prioritário para comunicados críticos.</li>
          <li>Recomendação editorial de legendas e transcrição para conteúdo audiovisual.</li>
          <li>Linguagem clara e estrutura por tópicos para leitura rápida.</li>
        </ul>
      </section>

      <section className="card" aria-labelledby="baixa-visao">
        <h2 id="baixa-visao">Pessoas com baixa visão</h2>
        <ul>
          <li>Modo de alto contraste no painel de acessibilidade.</li>
          <li>Ajuste de tamanho de fonte sem perda de layout.</li>
          <li>Leitura por voz da página (sintetizador do navegador).</li>
        </ul>
      </section>

      <section className="card" aria-labelledby="daltonismo">
        <h2 id="daltonismo">Pessoas com daltonismo</h2>
        <ul>
          <li>Seleção simples de modo de cores: padrão, protanopia, deuteranopia e tritanopia.</li>
          <li>Destaque adicional de links para reduzir dependência exclusiva de cor.</li>
          <li>Combinação com alto contraste para leitura de avisos críticos.</li>
        </ul>
      </section>

      <section className="card" aria-labelledby="mobilidade-cognicao">
        <h2 id="mobilidade-cognicao">Mobilidade reduzida e cognição</h2>
        <ul>
          <li>Navegação por teclado com foco visível.</li>
          <li>Atalho para pular direto ao conteúdo principal.</li>
          <li>Redução de movimento para evitar desconforto visual.</li>
        </ul>
      </section>
    </main>
  );
}
