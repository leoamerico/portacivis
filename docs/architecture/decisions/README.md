# Architecture Decision Records (ADRs)

Este diretório contém os registros de decisões arquiteturais (ADRs) do projeto PortaCivis.

---

## O que é uma ADR?

Uma **Architecture Decision Record** (ADR) é um documento que captura uma decisão arquitetural significativa tomada durante o desenvolvimento de um sistema, incluindo o contexto que motivou a decisão, a decisão em si, e as consequências esperadas.

O PortaCivis adota o formato **MADR** (Markdown Architectural Decision Records), que prioriza legibilidade e rastreabilidade em repositórios Git.

---

## Por que usamos ADRs?

- **Rastreabilidade:** toda decisão arquitetural significativa fica registrada e versionada no repositório.
- **Conformidade:** requisito dos frameworks e-ARQ Brasil e e-PING para governança arquitetural.
- **Onboarding:** novos membros da equipe entendem o contexto das decisões passadas.
- **Revisão:** decisões podem ser revisitadas com base em evidências documentadas.

---

## Quando criar uma ADR?

Crie uma ADR sempre que a decisão:

- Afetar a estrutura ou camadas arquiteturais do sistema.
- Introduzir ou remover uma dependência tecnológica significativa.
- Alterar um padrão de segurança, privacidade ou compliance.
- Impactar a estratégia de deployment, CI/CD ou observabilidade.
- Mudar a abordagem de internacionalização (i18n) ou acessibilidade.

Decisões menores (ajustes de estilo, refatorações internas sem impacto externo) **não** precisam de ADR.

---

## Como criar uma nova ADR

1. Copie o template: [`ADR-TEMPLATE.md`](./ADR-TEMPLATE.md)
2. Nomeie o arquivo seguindo o padrão: `ADR-NNN-titulo-curto.md`
   - Exemplo: `ADR-002-autenticacao-oauth2.md`
3. Preencha todas as seções obrigatórias (Status, Contexto, Decisão, Consequências).
4. Submeta via Pull Request — **toda PR de arquitetura requer ADR correspondente**.
5. Após aprovação, o status passa de `Proposto` para `Aceito`.

---

## Ciclo de vida dos status

| Status | Descrição |
|---|---|
| `Proposto` | ADR em revisão, aguardando aprovação |
| `Aceito` | Decisão aprovada e em vigor |
| `Obsoleto` | Substituído por ADR mais recente |
| `Rejeitado` | Proposta não aprovada (mantida para rastreabilidade) |
| `Supersedido` | Substituído, com referência ao ADR successor |

---

## Lista de ADRs

| ID | Título | Status | Data |
|---|---|---|---|
| [ADR-001](./ADR-001-governanca-de-compliance.md) | Governança de Compliance GovTech | Aceito | 2026-03-07 |
| [ADR-0042](./ADR-0042-brand-multiverse-architecture.md) | Brand Multiverse Architecture | Aceito | 2026-03-04 |
| [ADR-PORTACIVIS-BRAND-GOVERNANCE](./ADR-PORTACIVIS-BRAND-GOVERNANCE.md) | Brand Governance for PortaCivis | Aceito | — |

---

## Template

Use o arquivo [`ADR-TEMPLATE.md`](./ADR-TEMPLATE.md) como ponto de partida para novas ADRs.

---

## Referências

- [MADR — Markdown Architectural Decision Records](https://adr.github.io/madr/)
- [e-ARQ Brasil](https://www.gov.br/arquivonacional/pt-br/servicos/gestao-de-documentos/orientacao-tecnica-1/e-arq-brasil)
- [Dashboard de Gaps de Compliance](../../governance/DASHBOARD-GAPS.md)
- [Manifesto Operacional](../../../governance/MANIFESTO-OPERACIONAL.yaml)
