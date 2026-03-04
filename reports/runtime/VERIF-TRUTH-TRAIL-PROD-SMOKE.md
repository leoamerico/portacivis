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

## Recheck pós-push (commit `43027a6`)

Validação executada após push para `main` em `2026-03-04`:

- `GET /` -> `HTTP_CODE=200`
- Home contém `href="#mapa-brasil"`
- Home contém `id="mapa-brasil"`
- `GET /api/truth-trail/verify` -> `HTTP_CODE=200`
- `GET /api/truth-trail/audit` -> `HTTP_CODE=405` (método inválido para GET, endpoint ativo)
- `GET /verificacao-auditoria` -> `HTTP_CODE=200`

Teste de `POST /api/truth-trail/audit`:

- Payload incompleto -> `HTTP_CODE=400` com mensagens de campos obrigatórios
- Payload com campos de cadeia porém `previousHash` inválido -> `HTTP_CODE=409` (`Invalid previousHash for current chain head`)

Conclusão deste recheck:

- **Mapa na home: PASS** (âncora e seção em produção).
- **Rotas Truth Trail: ativas em produção** (`verify` e página em `200`; `audit` exige `POST` válido e integridade da cadeia).

## Smoke determinístico de `POST /audit` (ponta-a-ponta)

Execução adicional em `2026-03-04` para obter `200` no `POST` com assinatura correta:

- `GET /api/truth-trail/verify` antes: `200`, `chainLength=3`, `head=8f93e0de455ef7982753a48b3fb812b8ac8e8eeb7634dce25b0531c1fe22b9fd`
- `POST /api/truth-trail/audit` com:
  - todos os campos obrigatórios (`eventId`, `eventType`, `actorId`, `delegationContext`, `delegationId`, `timestamp`, `action`, `payload`, `payloadHash`, `correlationId`, `traceId`, `classification`, `previousHash`)
  - `previousHash` igual ao `head` retornado no `verify`
  - `payloadHash` calculado por SHA-256 do payload serializado

Resultado:

- `POST /api/truth-trail/audit` -> `HTTP_CODE=422`
- body: `{"success":false,"error":"Chain validation failed before persistence","issues":["Invalid hash at index 3"]}`
- `GET /api/truth-trail/verify` após: `200`, `chainLength=3` (sem evolução)

Conclusão desta etapa:

- A rota de auditoria está ativa, mas a persistência append-only em produção permanece bloqueada por validação de hash da cadeia.
