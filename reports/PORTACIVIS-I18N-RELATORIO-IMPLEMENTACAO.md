# PortaCivis — Relatório de Implementação de Internacionalização (i18n)

## 1. Objetivo

Definir uma estratégia técnica e executável para permitir **seleção de múltiplos idiomas** no portal `PortaCivis.com`, preservando o modelo de desenvolvimento adotado no projeto (Next.js App Router, foco em segurança, simplicidade operacional e deploy contínuo em Vercel).

---

## 2. Avaliação do modelo de desenvolvimento atual

## 2.1 Contexto atual observado
- Stack: `Next.js 15.5.12` + `React 18` + `TypeScript`.
- Arquitetura: App Router com páginas estáticas institucionais.
- Segurança: CSP e demais headers já tratados no `next.config.js`.
- Entrega: pipeline pragmático com build/deploy frequente.

## 2.2 Características do modelo escolhido (aderência)
O projeto está operando em um modelo **incremental e orientado a entregas curtas**, com:
- ajustes rápidos em produção;
- validação contínua por smoke/build;
- escopo focado em UX pública institucional.

Esse modelo é adequado para adoção de i18n por fases, desde que haja:
1. padronização do catálogo de mensagens;
2. governança de tradução;
3. critérios de fallback e qualidade linguística.

---

## 3. Solução open source recomendada

## 3.1 Biblioteca de runtime (portal)
**Recomendação principal: `next-intl` (open source)**
- Excelente aderência ao App Router do Next.js;
- suporte nativo a rotas localizadas;
- fallback por idioma;
- tipagem forte de mensagens no TypeScript;
- curva de adoção menor que alternativas genéricas.

## 3.2 Plataforma de gestão de traduções (opcional e recomendada)
**Recomendação: `Weblate` (open source, self-hosted opcional)**
- fluxo de revisão linguística por papéis;
- histórico de alterações;
- controle de qualidade de strings;
- integração com Git.

> Estratégia sugerida: `next-intl` para runtime + `Weblate` para governança editorial de tradução.

---

## 4. Análise de requisitos

## 4.1 Requisitos funcionais (RF)
- **RF-01**: O usuário pode selecionar idioma no cabeçalho/rodapé.
- **RF-02**: O idioma selecionado persiste entre páginas e sessões.
- **RF-03**: O portal suporta ao menos `pt-BR`, `en-US` e `es-ES` na fase inicial.
- **RF-04**: URLs podem refletir idioma (`/pt`, `/en`, `/es`) ou estratégia equivalente.
- **RF-05**: Conteúdo institucional está traduzido de forma consistente (menus, títulos, textos de cards, rodapé, consent banner, acessibilidade).
- **RF-06**: Se uma chave de tradução faltar, o sistema aplica fallback para `pt-BR`.
- **RF-07**: Datas/números podem ser formatados por localidade.

## 4.2 Requisitos não funcionais (RNF)
- **RNF-01 (Segurança)**: manter headers e CSP sem regressão.
- **RNF-02 (Performance)**: impacto mínimo no TTFB e bundle.
- **RNF-03 (Acessibilidade)**: seletor de idioma acessível por teclado e leitor de tela.
- **RNF-04 (Manutenibilidade)**: mensagens centralizadas por namespace/página.
- **RNF-05 (Auditabilidade)**: histórico de alterações de tradução rastreável.

## 4.3 Restrições
- Manter o portal estável em produção durante a migração.
- Evitar reescrita estrutural ampla fora do escopo i18n.

---

## 5. Casos de uso

## UC-01 — Selecionar idioma
- **Ator principal**: Cidadão visitante.
- **Pré-condição**: Portal carregado.
- **Fluxo principal**:
  1. Usuário abre seletor de idioma.
  2. Seleciona idioma desejado.
  3. Página recarrega/atualiza no idioma escolhido.
  4. Preferência é persistida.
- **Pós-condição**: UI e conteúdo textual passam a refletir o idioma selecionado.

## UC-02 — Persistência de preferência
- **Ator principal**: Cidadão visitante.
- **Fluxo principal**:
  1. Usuário retorna ao portal em nova sessão.
  2. Sistema recupera preferência (cookie/localStorage).
  3. Portal abre no idioma preferido.

## UC-03 — Fallback de chave ausente
- **Ator principal**: Sistema.
- **Fluxo principal**:
  1. Renderização solicita chave de tradução.
  2. Chave não existe no idioma ativo.
  3. Sistema busca em `pt-BR`.
  4. Se ainda ausente, registra erro de observabilidade e exibe texto de contingência.

## UC-04 — Revisão editorial de tradução
- **Ator principal**: Editor institucional.
- **Fluxo principal**:
  1. Tradutor/Editor propõe alteração de string.
  2. Revisor aprova.
  3. Mudança é versionada e publicada.

---

## 6. Análise de classes/componentes (modelo lógico)

> Embora o frontend use funções React, abaixo está o modelo de classes lógicas para orientar implementação e testes.

## 6.1 Classes de domínio/aplicação

### `LocaleConfig`
- **Responsabilidade**: definir idiomas suportados, idioma padrão e regras de fallback.
- **Atributos**:
  - `defaultLocale: string`
  - `supportedLocales: string[]`
  - `fallbackLocale: string`

### `TranslationCatalog`
- **Responsabilidade**: encapsular leitura de mensagens por namespace.
- **Atributos**:
  - `locale: string`
  - `messages: Record<string, string>`
- **Métodos**:
  - `get(key: string): string`
  - `has(key: string): boolean`

### `LocalePreferenceService`
- **Responsabilidade**: persistir e recuperar preferência do usuário.
- **Métodos**:
  - `read(): string | null`
  - `write(locale: string): void`
  - `clear(): void`

### `I18nErrorReporter`
- **Responsabilidade**: registrar chaves ausentes e inconsistências.
- **Métodos**:
  - `reportMissingKey(locale: string, key: string): void`

## 6.2 Componentes de apresentação

### `LanguageSwitcher`
- Seletor visual de idioma (header/rodapé).
- Acessível (`aria-label`, foco por teclado, estado selecionado).

### `LocalizedText`
- Componente utilitário para renderizar chave de tradução com fallback.

### `LocalizedLayout`
- Encapsula carregamento de mensagens e provider i18n por rota/locale.

---

## 7. Estrutura sugerida de código

```text
app/
  [locale]/
    layout.tsx
    page.tsx
    agentes/page.tsx
    noticias/page.tsx
    ...
messages/
  pt-BR/
    common.json
    home.json
    agentes.json
  en-US/
    common.json
    home.json
    agentes.json
  es-ES/
    common.json
    home.json
    agentes.json
lib/i18n/
  config.ts
  catalog.ts
  preference-service.ts
  error-reporter.ts
components/
  LanguageSwitcher.tsx
```

---

## 8. Plano de implementação (fases)

## Fase 0 — Preparação
- Definir idiomas iniciais: `pt-BR`, `en-US`, `es-ES`.
- Criar convenção de chaves (`page.section.element`).
- Criar dicionário base em português.

## Fase 1 — Infra i18n
- Instalar `next-intl`.
- Configurar middleware/rotas localizadas.
- Implementar `LocaleConfig` + provider por locale.

## Fase 2 — Migração de conteúdo
- Migrar páginas prioritárias:
  1. Home (`/`)
  2. Agentes (`/agentes`)
  3. Notícias (`/noticias`)
  4. Privacidade/Cookies/Termos/Conformidade/Acessibilidade
- Substituir strings hardcoded por chaves.

## Fase 3 — Seleção de idioma e persistência
- Implementar `LanguageSwitcher`.
- Persistir preferência com cookie (SSR-friendly) e fallback client.

## Fase 4 — Qualidade e governança
- Validar acessibilidade do seletor.
- Adicionar verificação de chaves faltantes no CI.
- Integrar fluxo editorial com Weblate (opcional).

---

## 9. Critérios de aceite

- Menu e páginas principais traduzidos para 3 idiomas.
- Troca de idioma funcional e persistente.
- Sem regressão de segurança (headers/CSP intactos).
- Sem regressão de favicon/rotas críticas.
- Build e smoke tests passando.
- Taxa de chave ausente em produção: zero crítica.

---

## 10. Riscos e mitigação

- **Risco**: inconsistência terminológica entre páginas.
  - **Mitigação**: glossário institucional + revisão editorial obrigatória.
- **Risco**: quebra de links com rotas localizadas.
  - **Mitigação**: mapa de rotas + testes de navegação.
- **Risco**: aumento de esforço de manutenção.
  - **Mitigação**: namespaces por página e lint de chaves.

---

## 11. Estimativa de esforço

- Fase 0-1: 1 a 2 dias úteis.
- Fase 2: 2 a 4 dias úteis (dependendo do volume textual final).
- Fase 3-4: 1 a 2 dias úteis.

**Total estimado**: 4 a 8 dias úteis para primeira versão estável de i18n.

---

## 12. Recomendação final

Adotar **`next-intl`** como padrão técnico de internacionalização e usar **`Weblate`** como camada open source de governança de tradução. A estratégia por fases é compatível com o modelo incremental atual do PortaCivis e reduz risco operacional, mantendo segurança e qualidade editorial.
