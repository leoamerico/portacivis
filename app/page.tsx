import Link from 'next/link';

export default function HomePage() {
  return (
    <main id="conteudo-principal" role="main">
      <nav aria-label="Navegação principal" className="card">
        <div className="quick-links">
          <Link href="/accessibilidade">Recursos de Acessibilidade</Link>
          <Link href="/privacidade">Privacidade (LGPD)</Link>
          <Link href="/termos">Termos de uso</Link>
          <Link href="/conformidade">Conformidade</Link>
        </div>
      </nav>

      <h1>PortaCivis — Portal do Cidadão</h1>
      <p>
        Canal oficial para o cidadão conhecer seus direitos e deveres, acessar serviços e
        acompanhar informações e transparência da cidade.
      </p>

      <section className="card">
        <h2>Serviços ao Cidadão</h2>
        <p>Solicitações, atendimento e orientações municipais.</p>
      </section>

      <section className="card">
        <h2>Notícias Oficiais</h2>
        <p>Atualizações institucionais e comunicados da prefeitura.</p>
      </section>

      <section className="card">
        <h2>Transparência</h2>
        <p>Dados públicos, relatórios e atos oficiais com referência de fonte.</p>
      </section>

      <section className="card" aria-labelledby="acessibilidade-titulo">
        <h2 id="acessibilidade-titulo">Acessibilidade</h2>
        <p>
          O portal possui suporte para alto contraste, aumento de fonte, leitura por voz,
          destaque de links e redução de movimento.
        </p>
      </section>
    </main>
  );
}
