# Architecture Decision Records

Este diretório contém todos os ADRs (Architecture Decision Records) do PortaCivis,
seguindo o padrão Michael Nygard adaptado para o contexto GovTech brasileiro.

## ADRs Ativos

| ID | Título | Status | Data |
|---|---|---|---|
| [ADR-001](ADR-001-governanca-de-compliance.md) | Governança de Compliance | Aceito | 2026-03-07 |

## Como Usar

1. Copie `ADR-TEMPLATE.md`
2. Renomeie para `ADR-XXX-titulo-kebab-case.md`
3. Preencha todas as seções
4. Adicione ao índice acima
5. Abra PR para revisão

Ou use o gerador automático:

```bash
bun run new-adr "Título da Decisão"
```

## Princípios

- Decisões arquiteturais significativas devem ter ADR
- ADRs são imutáveis (criar novo ADR para alterações, referenciar o anterior)
- Registrar alternativas consideradas e razões da rejeição
- Documentar trade-offs explicitamente
- Status válidos: `Proposto` | `Aceito` | `Rejeitado` | `Substituído por ADR-XXX` | `Depreciado`
