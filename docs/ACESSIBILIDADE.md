# Guia de Acessibilidade WCAG 2.1 AA

Este documento descreve como executar, interpretar e corrigir testes de acessibilidade no PortaCivis, em conformidade com a [Lei Brasileira de Inclusão (LBI)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm) e o padrão internacional WCAG 2.1 nível AA.

---

## Executar testes localmente

### Pré-requisitos

```bash
bun install
npx playwright install --with-deps chromium
```

### Iniciar o servidor de desenvolvimento e executar os testes

```bash
bun run a11y:dev
```

### Ou em dois terminais separados

```bash
# Terminal 1
bun run dev

# Terminal 2 (após o servidor iniciar)
bun run test:a11y
```

### Gerar relatório HTML/JSON

```bash
# Com o servidor rodando em http://localhost:3000
bun run a11y:report
```

O relatório é salvo em `reports/accessibility/`:
- `report.html` — relatório visual
- `report.json` — dados estruturados para integração

---

## Interpretar relatórios

Os relatórios classificam violações por severidade:

| Severidade | Cor     | Ação requerida                                      |
|------------|---------|-----------------------------------------------------|
| critical   | 🔴 Vermelho | **Bloqueia merge** — corrigir imediatamente     |
| serious    | 🟠 Laranja | **Bloqueia merge** — corrigir antes do deploy   |
| moderate   | 🟡 Amarelo | Gera issue automática — corrigir em sprint      |
| minor      | 🟢 Verde  | Registrar no backlog — melhorias futuras        |

O score de conformidade é calculado como `100 - (total_violations × 5)`, com mínimo 0.

---

## Correção de violações comuns

### `color-contrast` — Contraste insuficiente

Garantir que a relação de contraste entre texto e fundo seja:
- Mínimo **4.5:1** para texto normal
- Mínimo **3:1** para texto grande (≥18pt ou 14pt negrito)

Ferramentas: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### `image-alt` — Imagens sem texto alternativo

```html
<!-- Ruim -->
<img src="foto.jpg">

<!-- Bom -->
<img src="foto.jpg" alt="Descrição significativa da imagem">

<!-- Imagem decorativa -->
<img src="decoracao.svg" alt="" role="presentation">
```

### `label` — Campos de formulário sem rótulo

```html
<!-- Ruim -->
<input type="text" placeholder="Nome">

<!-- Bom -->
<label for="nome">Nome</label>
<input type="text" id="nome" placeholder="Digite seu nome">
```

### `heading-order` — Hierarquia de títulos incorreta

Garantir que os títulos sigam a ordem: `h1 → h2 → h3 → ...`, sem pular níveis.

### `link-name` — Links sem texto descritivo

```html
<!-- Ruim -->
<a href="/servicos">Clique aqui</a>

<!-- Bom -->
<a href="/servicos">Ver todos os serviços</a>
```

### `html-lang` — Atributo de idioma ausente

```html
<html lang="pt-BR">
```

---

## Checklist manual WCAG

Os itens a seguir requerem verificação manual pois não são detectáveis por ferramentas automatizadas:

### Navegação por teclado
- [ ] Todos os elementos interativos são acessíveis via `Tab`
- [ ] A ordem de foco é lógica e segue o fluxo visual
- [ ] Não há "armadilhas de foco" (focus traps) indesejadas
- [ ] Existe mecanismo para pular navegação repetitiva ("Ir para conteúdo principal")

### Leitor de tela
- [ ] Testado com NVDA (Windows) ou VoiceOver (macOS/iOS)
- [ ] Conteúdo dinâmico usa `aria-live` ou `aria-atomic` apropriados
- [ ] Modais e diálogos gerenciam foco corretamente
- [ ] Formulários anunciam erros de validação

### Contraste e cores
- [ ] Informações não dependem exclusivamente de cor para serem compreendidas
- [ ] Elementos de foco possuem indicador visual claro (outline)
- [ ] Testado com simulação de daltonismo

### Conteúdo de mídia
- [ ] Vídeos possuem legendas e transcrições
- [ ] Áudios possuem transcrições
- [ ] Animações podem ser pausadas ou desativadas

---

## Integração contínua

O workflow `.github/workflows/accessibility.yml` executa automaticamente os testes de acessibilidade em cada push e pull request. Violações `critical` ou `serious` bloqueiam o merge.

Para executar o workflow localmente com [act](https://github.com/nektos/act):

```bash
act push -j wcag
```

---

## Referências

- [WCAG 2.1](https://www.w3.org/TR/WCAG21/) — W3C
- [Lei Brasileira de Inclusão — LBI (Lei 13.146/2015)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm)
- [eMAG — Modelo de Acessibilidade em Governo Eletrônico](https://emag.governoeletronico.gov.br/)
- [axe-core](https://github.com/dequelabs/axe-core) — Motor de análise automatizada
- [Playwright](https://playwright.dev/) — Framework de testes E2E
