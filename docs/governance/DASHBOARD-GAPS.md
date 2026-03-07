# Dashboard de Compliance — PortaCivis

> Última atualização: 2026-03-07 | Responsável: ENV-NEO LTDA

---

## Progresso Geral

| Total de Gaps | Endereçados | Restantes | Progresso |
|---|---|---|---|
| 15 | 7 | 8 | 47% ████░░░░░░ |

---

## Status por Prioridade

| Prioridade | Total | Concluídos | Em andamento | Pendentes |
|---|---|---|---|---|
| P0 (Crítico) | 3 | 3 | 0 | 0 |
| P1 (Alto) | 4 | 4 | 0 | 0 |
| P2 (Médio) | 5 | 0 | 2 | 3 |
| P3 (Baixo) | 3 | 0 | 0 | 3 |

---

## Detalhamento por PR

| PR | Gap(s) | Descrição | Progresso estimado |
|---|---|---|---|
| #1 | GAP-001 | Segurança de headers HTTP | ✅ 100% |
| #2 | GAP-002 | Internacionalização (i18n) multi-idioma | ✅ 100% |
| #3 | GAP-003 | Governança de marca (Brand-as-Code) | ✅ 100% |
| #4 | GAP-004 | Rastreabilidade de decisões arquiteturais (ADR) | 🔄 75% |
| #5 | GAP-005 | Acessibilidade (WCAG 2.1 AA) | ✅ 100% |
| #6 | GAP-006 | Trilha de auditoria (Truth Trail) | ✅ 100% |
| #7 | GAP-007 | Smart Cities / contexto territorial | ✅ 100% |

---

## Gaps Restantes — P2

| ID | Título | Área | Dependência |
|---|---|---|---|
| GAP-008 | Testes automatizados de regressão | Qualidade | GAP-002 |
| GAP-009 | Monitoramento de performance (Core Web Vitals) | Observabilidade | — |
| GAP-010 | Cache e CDN policy | Infraestrutura | — |

---

## Gaps Restantes — P3

| ID | Título | Área | Dependência |
|---|---|---|---|
| GAP-011 | Documentação de API pública | Documentação | — |
| GAP-012 | Plano de continuidade de negócios (BCP) | Resiliência | — |
| GAP-013 | Relatório de conformidade automatizado (PDF) | Compliance | GAP-004 |
| GAP-014 | Pipeline de release semântico | DevOps | — |
| GAP-015 | Internacionalização de datas/moedas | i18n avançado | GAP-002 |

---

## Métricas de Conformidade Projetadas

| Framework | Atual | Meta Q2 2026 | Meta Q4 2026 |
|---|---|---|---|
| e-PING (Interoperabilidade) | 65% | 80% | 95% |
| e-ARQ Brasil (Arquivística) | 40% | 65% | 85% |
| LGPD (Privacidade) | 70% | 85% | 100% |
| LAI (Transparência) | 55% | 75% | 90% |

---

## Timeline de Implementação

```
2026-Q1 ████████████████ P0/P1 concluídos (GAP-001 a GAP-007)
2026-Q2 ████████░░░░░░░░ P2 em andamento (GAP-008 a GAP-010)
2026-Q3 ████░░░░░░░░░░░░ P3 iniciado    (GAP-011 a GAP-013)
2026-Q4 ████████████████ Conformidade plena
```

| Marco | Data alvo | Status |
|---|---|---|
| P0/P1 completos | 2026-03-31 | ✅ Concluído |
| e-PING 80% | 2026-06-30 | 🔄 Em andamento |
| LGPD 100% | 2026-09-30 | ⏳ Pendente |
| Conformidade plena | 2026-12-31 | ⏳ Pendente |

---

## Referências

- [ADR-001: Governança de Compliance](../architecture/decisions/ADR-001-governanca-de-compliance.md)
- [MANIFESTO-OPERACIONAL](../../governance/MANIFESTO-OPERACIONAL.yaml)
- [BACKLOG-EXECUCAO](../../governance/BACKLOG-EXECUCAO.yaml)
