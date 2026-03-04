# PortaCivis — CI com `verify:all` obrigatório

- Data: 2026-03-04
- Objetivo: bloquear merge/deploy quando qualquer gate de segurança, i18n, build ou smoke falhar.

## Workflows atualizados

- `.github/workflows/ci.yml`
  - adicionada variável de ambiente: `CANONICAL_URL=https://www.portacivis.com.br`
  - etapa principal alterada para: `npm run verify:all`

- `.github/workflows/security-foundation.yml`
  - adicionada variável de ambiente: `CANONICAL_URL=https://www.portacivis.com.br`
  - etapas anteriores consolidadas em: `npm run verify:all`

## Evidência técnica local

Comando executado:
- `npm run verify:all`

Resultado:
- `security:headers`: PASS
- `test:i18n`: PASS
- `build`: PASS
- `test:smoke`: PASS

## Conclusão

O gate único `verify:all` está integrado ao CI e configurado para operar com o domínio canônico atual, reduzindo risco de falso negativo no smoke check e garantindo bloqueio consistente de qualidade.
