# GO-LIVE-ACCEPTANCE-TRUTH-TRAIL

Data: 2026-03-04
Projeto: PortaCivis
Ambiente alvo: produção canônica (`https://www.portacivis.com.br`)

## Escopo de aceite

- Endpoint `GET /api/truth-trail/verify`
- Endpoint `POST /api/truth-trail/audit`
- Página `GET /verificacao-auditoria`
- Render i18n da página em `pt-BR`, `en-US`, `es-ES`

## Critérios de aprovação (obrigatórios)

1. `GET /api/truth-trail/verify` retorna `200` com `success=true` e `issues=[]`
2. `POST /api/truth-trail/audit` retorna `200`
3. Após `POST`, `GET /api/truth-trail/verify` mantém `issues=[]` e cadeia íntegra
4. `GET /verificacao-auditoria` retorna `200` em `pt-BR`, `en-US`, `es-ES`
5. Comando único `BASE_URL=https://www.portacivis.com.br npm run test:truth-trail` retorna `PASS`

## Evidência da última execução

- Resultado smoke automatizado: **FAIL**
- Arquivo de evidência: `reports/runtime/SMOKE-TRUTH-TRAIL-LAST.md`
- Relatório consolidado: `reports/runtime/VERIF-TRUTH-TRAIL-PROD-SMOKE.md`

Resumo técnico atual:

- `GET /api/truth-trail/verify` -> `404`
- `GET /api/truth-trail/audit` -> `404`
- `GET /verificacao-auditoria` -> `404`

## Decisão de release

- **NO-GO** para Truth Trail em produção no estado atual.

## Última validação executada

- Timestamp: `2026-03-04T16:22:04.548Z`
- `npm run test:truth-trail` -> `FAIL`
- `GET /api/truth-trail/verify` -> `404`
- `GET /api/truth-trail/audit` -> `404`
- `GET /verificacao-auditoria` -> `404`

## Condição para liberar GO

- Re-publicar versão que contenha os artefatos Truth Trail e reexecutar:

```bash
BASE_URL=https://www.portacivis.com.br npm run test:truth-trail
```

- Registrar resultado `PASS` em `reports/runtime/SMOKE-TRUTH-TRAIL-LAST.md`.