# PR — Truth Trail Runtime Fix (escopo único)

## Título sugerido

`fix(truth-trail): restore runtime by removing invalid alias imports and hardening recorder response typing`

## Resumo

Este PR corrige o fluxo de auditoria Truth Trail em runtime, eliminando erro 500 causado por imports com alias `@/...` sem configuração em `tsconfig`, e ajusta tipagem mínima do recorder para refletir contrato real de resposta do endpoint.

## Política aplicada (Gate 0)

- Root validado: `D:/portacivis`
- Artefatos verificados antes de executar testes
- `tsconfig.json` sem `baseUrl/paths`
- Decisão mandatória: **imports relativos** (sem `@/...`)

## Arquivos alterados

- `app/api/truth-trail/audit/route.ts`
- `app/api/truth-trail/verify/route.ts`
- `app/components/TruthTrailAuditRecorder.tsx`

## Evidências (local)

- Runtime verify: `GET /api/truth-trail/verify` -> `200`
- E2E audit->verify: `POST /api/truth-trail/audit` com `previousHash=head` -> `200`; `head` evolui; `issues=[]`
- i18n página `/verificacao-auditoria`: `pt-BR`, `en-US`, `es-ES` -> `200` e título correto
- Build: `npm run build` -> PASS

Relatório detalhado:
- `reports/runtime/VERIF-TRUTH-TRAIL.md`

## Situação pós-deploy canônico

Smoke em produção canônica no momento do teste retornou `404` para:
- `/api/truth-trail/verify`
- `/api/truth-trail/audit`
- `/verificacao-auditoria`

Relatório:
- `reports/runtime/VERIF-TRUTH-TRAIL-PROD-SMOKE.md`

## Checklist

- [x] Correção mínima da causa-raiz
- [x] Sem dependências novas
- [x] Sem reestruturação de pastas
- [x] Build local PASS
- [x] Evidência versionada em `reports/runtime`
