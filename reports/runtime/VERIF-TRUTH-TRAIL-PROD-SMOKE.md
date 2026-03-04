# VERIF-TRUTH-TRAIL-PROD-SMOKE

Data: 2026-03-04
Projeto: PortaCivis
Ambiente: Produção canônica (`https://www.portacivis.com.br`)
Escopo: smoke pós-deploy para Truth Trail (`verify`, `audit`, `/verificacao-auditoria`).

## Comandos executados

```bash
for url in \
  https://www.portacivis.com.br/api/truth-trail/verify \
  https://www.portacivis.com.br/api/truth-trail/audit \
  https://www.portacivis.com.br/verificacao-auditoria
  do
    echo "== $url =="
    curl -s -o /tmp/prod_resp.txt -w "HTTP_CODE=%{http_code}\n" "$url"
    head -c 220 /tmp/prod_resp.txt
    echo
    echo
  done
```

## Saída essencial

- `GET /api/truth-trail/verify` -> `HTTP_CODE=404`
- `GET /api/truth-trail/audit` -> `HTTP_CODE=404`
- `GET /verificacao-auditoria` -> `HTTP_CODE=404`

Resposta em todos os casos: HTML de página 404 do Next.js.

## Conclusão

- O smoke pós-deploy do Truth Trail no host canônico: **FAIL**.
- Causa observável: artefatos de runtime do Truth Trail não estão presentes na versão atualmente publicada em produção.

## Ação necessária

1. Publicar a versão que contém:
   - `app/api/truth-trail/audit/route.ts`
   - `app/api/truth-trail/verify/route.ts`
   - `app/verificacao-auditoria/page.tsx`
2. Reexecutar smoke canônico com a mesma sequência:
   - `GET /api/truth-trail/verify` deve retornar `200`
   - `POST /api/truth-trail/audit` deve retornar `200` e evoluir `head`
   - `GET /verificacao-auditoria` em `pt/en/es` deve retornar `200` com título correto

## Recheck (mesma data)

Revalidação executada novamente em `2026-03-04` no host canônico:

- `GET /api/truth-trail/verify` -> `HTTP_CODE=404`
- `GET /api/truth-trail/audit` -> `HTTP_CODE=404`
- `GET /verificacao-auditoria` -> `HTTP_CODE=404`

Conclusão do recheck:

- Status permanece **FAIL** até publicação da versão que contém os artefatos Truth Trail.

## Recheck automatizado (script dedicado)

Comando executado:

```bash
BASE_URL=https://www.portacivis.com.br node scripts/smoke-truth-trail.mjs
```

Saída essencial:

- `Truth Trail smoke: FAIL - verify endpoint returned non-200`
- `VERIFY_BEFORE status: 404`

Arquivo de evidência gerado automaticamente:

- `reports/runtime/SMOKE-TRUTH-TRAIL-LAST.md`

## Recheck automatizado (execução mais recente)

Execução em `2026-03-04T16:15:20.777Z`:

- `npm run test:truth-trail` -> `FAIL`
- `GET /api/truth-trail/verify` -> `HTTP_CODE=404`
- `GET /api/truth-trail/audit` -> `HTTP_CODE=404`
- `GET /verificacao-auditoria` -> `HTTP_CODE=404`

Conclusão:

- Produção canônica permanece sem os artefatos Truth Trail ativos.

## Tentativa final após confirmação de deploy

Validação executada após confirmação de publicação em `2026-03-04T16:19:27.022Z`:

- `npm run test:truth-trail` -> `FAIL` (`verify endpoint returned non-200`)
- `GET /api/truth-trail/verify` -> `HTTP_CODE=404`
- `GET /api/truth-trail/audit` -> `HTTP_CODE=404`
- `GET /verificacao-auditoria` -> `HTTP_CODE=404`

Resultado desta tentativa:

- Host canônico ainda não expõe os artefatos Truth Trail na versão ativa.

## Tentativa final (confirmação adicional)

Execução em `2026-03-04T16:22:04.548Z`:

- `npm run test:truth-trail` -> `FAIL`
- `GET /api/truth-trail/verify` -> `HTTP_CODE=404`
- `GET /api/truth-trail/audit` -> `HTTP_CODE=404`
- `GET /verificacao-auditoria` -> `HTTP_CODE=404`

Conclusão:

- Status permanece **FAIL** no host canônico após confirmação adicional.
