# RELEASE-CHECKLIST-TRUTH-TRAIL

Data: 2026-03-04
Projeto: PortaCivis
Escopo: liberar Truth Trail em produção canônica com validação auditável.

## 1) Pré-release (local)

Executar:

```bash
bun run verify:all
```

Esperado:

- `governance:verify` PASS
- `security:headers` PASS
- `test:i18n` PASS
- `build` PASS
- `test:smoke` PASS

## 2) Deploy

- Publicar versão que contém:
  - `app/api/truth-trail/verify/route.ts`
  - `app/api/truth-trail/audit/route.ts`
  - `app/verificacao-auditoria/page.tsx`

## 3) Pós-release (produção canônica)

Executar:

```bash
BASE_URL=https://www.portacivis.com.br bun run test:truth-trail
```

Saída esperada:

- `Truth Trail smoke: PASS`
- arquivo `reports/runtime/SMOKE-TRUTH-TRAIL-LAST.md` com `Resultado: PASS`

## 4) Critério objetivo de Go/No-Go

- GO: todos os passos acima em PASS.
- NO-GO: qualquer 404/500 nos endpoints/page Truth Trail ou `Resultado: FAIL`.

## 5) Evidências relacionadas

- `reports/runtime/VERIF-TRUTH-TRAIL.md` (local PASS)
- `reports/runtime/VERIF-TRUTH-TRAIL-PROD-SMOKE.md` (produção atual)
- `reports/runtime/SMOKE-TRUTH-TRAIL-LAST.md` (última execução automatizada)
- `reports/runtime/GO-LIVE-ACCEPTANCE-TRUTH-TRAIL.md` (decisão GO/NO-GO)