# PortaCivis

Portal do Cidadão: serviços, informações e transparência.

[![PortaCivis CI](https://github.com/leoamerico/portacivis/actions/workflows/ci.yml/badge.svg)](https://github.com/leoamerico/portacivis/actions/workflows/ci.yml)
[![Security Foundation](https://github.com/leoamerico/portacivis/actions/workflows/security-foundation.yml/badge.svg)](https://github.com/leoamerico/portacivis/actions/workflows/security-foundation.yml)
[![i18n Regression](https://github.com/leoamerico/portacivis/actions/workflows/i18n.yml/badge.svg)](https://github.com/leoamerico/portacivis/actions/workflows/i18n.yml)
[![Canonical Smoke](https://github.com/leoamerico/portacivis/actions/workflows/smoke.yml/badge.svg)](https://github.com/leoamerico/portacivis/actions/workflows/smoke.yml)

## Requisitos

- Node.js 20+
- Bun 1.3+

## Execução local

```bash
bun install
bun run dev
```

Compatibilidade (opcional): também é possível executar com `npm`, quando necessário.

## Build

```bash
bun run build
bun run start
```

## Segurança (fundação)

```bash
bun run security:headers
bun run security:verify
bun run governance:verify
bun run test:i18n
bun run test:smoke
bun run verify:all
```

- `governance:verify`: valida presença e integridade mínima dos artefatos operacionais (`MANIFESTO-OPERACIONAL`, `RACI`, `SLO-RUNBOOK`).
- `security:headers`: valida presença de headers de segurança no `next.config.js`.
- `security:verify`: executa validação de segurança + regressão i18n + build bloqueante.
- `test:i18n`: valida conteúdo multilíngue (pt-BR, en-US, es-ES) por smoke checks com cookie de locale.
- `test:smoke`: verifica saúde da URL canônica (`CANONICAL_URL`, padrão `https://www.portacivis.com.br`).
- `verify:all`: executa `security:verify` + `test:smoke` em sequência para validação pré-deploy.
- Workflow `smoke.yml`: monitoramento automático diário do domínio canônico (10:00 UTC), além de push/PR e execução manual.
- Em falha do `smoke.yml` no agendamento diário, uma issue automática é aberta (ou atualizada) para resposta de incidente.

## Governança operacional (resiliência)

- `governance/MANIFESTO-OPERACIONAL.yaml`: princípios, gates obrigatórios e diretrizes de resiliência.
- `governance/RACI-OPERACAO.yaml`: ownership e responsabilidades por processo.
- `governance/SLO-RUNBOOK.yaml`: SLI/SLO, orçamento de erro e resposta a incidentes.

## Criar repositório no GitHub

Com GitHub CLI autenticado:

```bash
git init
git add .
git commit -m "chore: bootstrap portacivis portal"
git branch -M main
gh repo create portacivis --public --source . --remote origin --push
```

Sem GitHub CLI:

1. Crie o repositório `portacivis` no GitHub.
2. Execute:

```bash
git init
git add .
git commit -m "chore: bootstrap portacivis portal"
git branch -M main
git remote add origin https://github.com/<seu-usuario>/portacivis.git
git push -u origin main
```

## Conectar na Vercel

1. Vercel → `Add New Project` → importar `portacivis`.
2. Build command: `npm run build`.
3. Output framework: Next.js (auto).
4. Região: GRU (`gru1`).

## Domínios

No projeto Vercel, adicionar e configurar:

- `www.portacivis.com.br` (Primary)
- `portacivis.com.br` → 301 para `https://www.portacivis.com.br`
- `portacivis.com` → 301 para `https://www.portacivis.com.br`
- `www.portacivis.com` → 301 para `https://www.portacivis.com.br`
- `portacivis.online` → 301 para `https://www.portacivis.com.br`
- `www.portacivis.online` → 301 para `https://www.portacivis.com.br`
