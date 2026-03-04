# PortaCivis — i18n Fase 2 (Execução)

- Data: 2026-03-04
- Escopo: migração de strings hardcoded para catálogos de tradução e ativação multilíngue nas páginas e componentes principais.

## Implementação realizada

- Catálogos de mensagens expandidos para `pt-BR`, `en-US`, `es-ES`:
  - `messages/*/common.json` com chaves para home, agentes, notícias, acessibilidade, conformidade, privacidade, cookies, termos, banner de consentimento e painel de acessibilidade.
- Páginas migradas para `getTranslations`:
  - `/`
  - `/agentes`
  - `/noticias`
  - `/accessibilidade`
  - `/conformidade`
  - `/privacidade`
  - `/cookies-e-cache`
  - `/termos`
- Componentes client migrados para `useTranslations`:
  - `ConsentBanner`
  - `AccessibilityPanel`
- Painel de acessibilidade ajustado para leitura de voz no idioma selecionado (`utterance.lang = locale`).

## Requisitos cobertos

- RF-01 Seleção de idioma: **ATENDIDO**.
- RF-02 Persistência da preferência: **ATENDIDO**.
- RF-03 Idiomas iniciais (`pt-BR`, `en-US`, `es-ES`): **ATENDIDO**.
- RF-05 Conteúdo institucional consistente e traduzível: **ATENDIDO** (Fase 2).
- RF-06 Fallback para `pt-BR`: **ATENDIDO**.
- RNF-01 Segurança sem regressão: **ATENDIDO**.

## Casos de uso

- UC-01 Selecionar idioma: **ATENDIDO**.
- UC-02 Persistência de preferência: **ATENDIDO**.
- UC-03 Fallback de chave ausente: **ATENDIDO no runtime** (observabilidade de chaves ausentes fica para Fase 4).
- UC-04 Revisão editorial de tradução: **PENDENTE** (governança com Weblate/processo editorial).

## Evidências técnicas

- Build de produção: PASS.
- Sem erros de análise estática nos arquivos migrados.
- Verificação em produção com cookie de locale:
  - `PORTACIVIS_LOCALE=en-US` => textos em inglês.
  - `PORTACIVIS_LOCALE=es-ES` => textos em espanhol.
  - sem cookie => português padrão.
- Headers de segurança/CSP preservados.

## Próximo passo (Fase 3)

- Refinar UX de troca de idioma:
  - opcionalmente evitar `window.location.reload()` com navegação mais suave;
  - ampliar cobertura de formatação regional (datas/números) onde houver conteúdo dinâmico;
  - adicionar testes de regressão i18n no pipeline.
