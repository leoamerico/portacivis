# PortaCivis — i18n Fase 3 (Execução)

- Data: 2026-03-04
- Escopo: melhoria da UX da troca de idioma e inclusão de teste automatizado de regressão i18n.

## Implementações realizadas

- `LanguageSwitcher` atualizado para evitar reload completo:
  - antes: `window.location.reload()`
  - agora: `router.refresh()` com `useTransition` para atualização suave de Server Components.
- Controle de estado durante troca de idioma:
  - `select` desabilitado temporariamente enquanto a atualização está pendente.
- Teste de regressão i18n criado:
  - arquivo: `scripts/verify-i18n-smoke.mjs`
  - script npm: `test:i18n`

## Validações

- Build: **PASS**.
- Teste i18n: **PASS**.
  - pt-BR (`/`): texto esperado encontrado.
  - en-US (`/agentes`): texto esperado encontrado.
  - es-ES (`/privacidade`): texto esperado encontrado.
- Deploy em produção: **concluído**.

## Arquivos alterados

- `app/components/LanguageSwitcher.tsx`
- `scripts/verify-i18n-smoke.mjs`
- `package.json`

## Resultado

- UX de troca de idioma melhorada, mantendo arquitetura atual do projeto.
- Regressão i18n agora coberta por script automatizado executável (`npm run test:i18n`).
