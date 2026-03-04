# PortaCivis — Execução do fluxo `verify:all`

- Data: 2026-03-04
- Objetivo: consolidar verificação pré-deploy em comando único.

## Alterações aplicadas

- `package.json`
  - adicionado script `verify:all`:
    - `npm run security:verify && npm run test:smoke`
- `README.md`
  - documentação do comando `verify:all`
- `scripts/smoke-domain.mjs`
  - default `CANONICAL_URL` atualizado para `https://www.portacivis.com.br`

## Validação executada

Comandos:
- `npm run test:smoke`
- `npm run verify:all`

Resultados:
- `test:smoke`: PASS
- `security:headers`: PASS
- `test:i18n`: PASS
- `build`: PASS
- `verify:all`: PASS

## Conclusão

O portal agora possui gate único e funcional de pré-deploy, cobrindo segurança, i18n, build e smoke do domínio canônico atual.
