# PortaCivis — Integração de Gate i18n no Pipeline

- Data: 2026-03-04
- Objetivo: tornar a verificação i18n obrigatória no fluxo de validação antes de build/deploy.

## Alterações realizadas

- package.json
  - `security:verify` atualizado para:
    - `npm run security:headers && npm run test:i18n && npm run build`
- README.md
  - Documentação atualizada com:
    - comando `npm run test:i18n`
    - descrição do novo gate obrigatório dentro de `security:verify`

## Evidência de execução

Comando executado:
- `npm run security:verify`

Resultado:
- `security:headers`: PASS
- `test:i18n`: PASS
- `build`: PASS

## Conclusão

A regressão de internacionalização passou a ser um gate obrigatório no pipeline local de verificação de qualidade.
