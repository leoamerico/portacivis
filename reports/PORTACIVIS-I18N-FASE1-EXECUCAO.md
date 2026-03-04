# PortaCivis — i18n Fase 1 (Execução)

- Data: 2026-03-04
- Escopo: implementação da infraestrutura open source de internacionalização.

## Implementado

- Biblioteca open source integrada: `next-intl`.
- Configuração de locale/cookie/fallback concluída.
- Catálogos iniciais criados para `pt-BR`, `en-US` e `es-ES`.
- Provider i18n integrado ao layout global.
- Seletor de idioma funcional com persistência por cookie.
- Navegação e rodapé com chaves traduzíveis em runtime.

## Rastreamento de requisitos

- RF-01 (seleção de idioma): **ATENDIDO**.
- RF-02 (persistência): **ATENDIDO** (cookie `PORTACIVIS_LOCALE`).
- RF-03 (3 idiomas iniciais): **ATENDIDO**.
- RF-06 (fallback pt-BR): **ATENDIDO**.
- RNF-01 (segurança sem regressão): **ATENDIDO** (CSP/headers preservados).

## Casos de uso cobertos na Fase 1

- UC-01 Selecionar idioma: **ATENDIDO**.
- UC-02 Persistência de preferência: **ATENDIDO**.
- UC-03 Fallback de chave ausente: **PARCIAL** (base pronta; observabilidade completa na Fase 4).
- UC-04 Revisão editorial de tradução: **PENDENTE** (Weblate/processo editorial na Fase 4).

## Classes/componentes implementados

- `LocaleConfig` (arquivo de configuração de locales e validação).
- `LocalePreferenceService` (estratégia de preferência via cookie, materializada no switcher/request).
- `TranslationCatalog` (catálogos JSON por idioma/namespace).
- `LanguageSwitcher` (componente de seleção de idioma).
- `LocalizedLayout` (layout global com provider i18n).

## Evidências técnicas

- Build local: PASS.
- Deploy de produção: concluído.
- Verificação por cookie em produção:
  - `PORTACIVIS_LOCALE=en-US` => textos compartilhados em inglês.
  - `PORTACIVIS_LOCALE=es-ES` => textos compartilhados em espanhol.
  - Sem cookie => português padrão.

## Próxima fase recomendada (Fase 2)

- Migrar conteúdo hardcoded das páginas (`/`, `/agentes`, `/noticias`, institucionais) para chaves por namespace (`home`, `agentes`, `noticias`, `privacy`, etc.).
- Padronizar revisão linguística e glossário institucional para consistência terminológica.
