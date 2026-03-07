# Dashboard de Gaps de Compliance — PortaCivis

> Atualizado em: 2026-03-07 | Responsável: Leonardo Américo (Arquiteto)

---

## Visão Geral

| Métrica | Valor |
|---|---|
| Conformidade atual | 47,5% |
| Conformidade projetada (pós-PRs em curso) | 75% |
| Gaps identificados | 15 |
| PRs em andamento | 1 (atual) + 4 futuros |
| Frameworks cobertos | e-PING, e-ARQ Brasil, LGPD, LAI |

---

## Conformidade por Framework

| Framework | Descrição | Conformidade Atual | Meta |
|---|---|---|---|
| e-PING | Interoperabilidade | 50% | 80% |
| e-ARQ Brasil | Camadas arquiteturais | 45% | 75% |
| LGPD | Proteção de dados pessoais | 40% | 80% |
| LAI | Transparência e acesso à informação | 55% | 70% |

---

## Status dos 15 Gaps Identificados

| ID | Descrição | Framework | Prioridade | Status |
|---|---|---|---|---|
| GAP-001 | Ausência de ADRs documentadas para decisões arquiteturais | e-ARQ Brasil | P0 | ✅ Resolvido (este PR) |
| GAP-002 | Política de proteção de dados sem formalização | LGPD | P0 | 🔄 Em andamento |
| GAP-003 | Headers de segurança incompletos | e-PING | P0 | ✅ Resolvido |
| GAP-004 | Estrutura de governance e ADRs não estabelecida | e-ARQ Brasil | P0 | ✅ Resolvido (este PR) |
| GAP-005 | Falta de quality gates automáticos para compliance | e-PING / e-ARQ | P1 | 🔄 Em andamento |
| GAP-006 | Ausência de dashboard de acompanhamento de conformidade | e-ARQ Brasil | P1 | ✅ Resolvido (este PR) |
| GAP-007 | Validação de ADRs não automatizada em CI/CD | e-ARQ Brasil | P1 | ✅ Resolvido (este PR) |
| GAP-008 | Logs de auditoria sem retenção definida | LGPD | P1 | ⏳ Backlog P1 |
| GAP-009 | Ausência de política de retenção de dados | LGPD | P1 | ⏳ Backlog P1 |
| GAP-010 | Interface pública sem declaração de acessibilidade | e-PING / LAI | P2 | ⏳ Backlog P2 |
| GAP-011 | Catálogo de serviços público não estruturado | LAI | P2 | ⏳ Backlog P2 |
| GAP-012 | Relatório de transparência sem periodicidade definida | LAI | P2 | ⏳ Backlog P2 |
| GAP-013 | Ausência de mecanismo de solicitação de dados (LGPD art. 18) | LGPD | P2 | ⏳ Backlog P2 |
| GAP-014 | Interoperabilidade com serviços externos não validada | e-PING | P3 | ⏳ Backlog P3 |
| GAP-015 | Documentação de API pública incompleta | e-PING | P3 | ⏳ Backlog P3 |

**Legenda:** ✅ Resolvido | 🔄 Em andamento | ⏳ Backlog

---

## Progresso dos PRs

| PR | Descrição | Gaps Cobertos | Status |
|---|---|---|---|
| PR atual | GAP-004: Estrutura ADR + dashboard compliance | GAP-001, GAP-004, GAP-006, GAP-007 | 🔄 Em andamento |
| PR-2 | Proteção de dados e política LGPD | GAP-002, GAP-008, GAP-009 | ⏳ Planejado |
| PR-3 | Quality gates e automação de compliance | GAP-003, GAP-005 | ⏳ Planejado |
| PR-4 | Transparência e catálogo LAI | GAP-010, GAP-011, GAP-012 | ⏳ Planejado |
| PR-5 | Interoperabilidade e API pública | GAP-013, GAP-014, GAP-015 | ⏳ Planejado |

---

## Tabela de Priorização

### P0 — Crítico (bloqueante)

| Gap | Impacto | Prazo |
|---|---|---|
| GAP-001 | Rastreabilidade arquitetural ausente | Imediato |
| GAP-002 | Risco legal LGPD | Imediato |
| GAP-003 | Exposição de segurança | Imediato |
| GAP-004 | Governance não estruturado | Imediato |

### P1 — Alto (próximo sprint)

| Gap | Impacto | Prazo |
|---|---|---|
| GAP-005 | Validação manual sujeita a erro | Sprint +1 |
| GAP-006 | Visibilidade de conformidade ausente | Sprint +1 |
| GAP-007 | CI/CD sem validação de ADRs | Sprint +1 |
| GAP-008 | Rastreabilidade de dados limitada | Sprint +1 |
| GAP-009 | Risco de retenção indevida | Sprint +1 |

### P2 — Médio (backlog estruturado)

| Gap | Impacto | Prazo |
|---|---|---|
| GAP-010 | Acessibilidade digital não declarada | Sprint +2 |
| GAP-011 | Catálogo de serviços inacessível | Sprint +2 |
| GAP-012 | Transparência sem ciclo definido | Sprint +2 |
| GAP-013 | Direito do titular não garantido | Sprint +2 |

### P3 — Baixo (backlog futuro)

| Gap | Impacto | Prazo |
|---|---|---|
| GAP-014 | Integração sem validação formal | Sprint +3 |
| GAP-015 | Documentação incompleta para parceiros | Sprint +3 |

---

## Projeção de Conformidade

```
Atual:          [████████████░░░░░░░░░░░░] 47,5%
Pós-PRs atuais: [██████████████████░░░░░░] 75,0%
Meta final:     [████████████████████████] 100%
```

| Marco | Conformidade | PRs concluídos |
|---|---|---|
| Estado atual | 47,5% | 0 |
| Pós PR-1 (este) | 55% | 1 |
| Pós PR-2 | 63% | 2 |
| Pós PR-3 | 68% | 3 |
| Pós PR-4 | 72% | 4 |
| Pós PR-5 | 75% | 5 |

---

## Backlog P2/P3 Estruturado

### P2 — Detalhamento

#### GAP-010: Declaração de Acessibilidade
- **Ação:** Criar `docs/accessibility/DECLARACAO-ACESSIBILIDADE.md`
- **Frameworks:** e-PING (eMAG), LAI
- **Critério de aceite:** Documento publicado, link no rodapé do portal

#### GAP-011: Catálogo de Serviços Público
- **Ação:** Estruturar `docs/services/CATALOGO-SERVICOS.md`
- **Frameworks:** LAI (art. 8º)
- **Critério de aceite:** Todos os serviços listados com descrição e SLA

#### GAP-012: Relatório de Transparência
- **Ação:** Criar template `docs/transparency/RELATORIO-TRANSPARENCIA.md`
- **Frameworks:** LAI
- **Critério de aceite:** Relatório semestral publicado

#### GAP-013: Mecanismo de Solicitação de Dados (LGPD art. 18)
- **Ação:** Implementar endpoint `/api/privacy/request`
- **Frameworks:** LGPD
- **Critério de aceite:** Titular pode solicitar acesso, correção e exclusão de dados

### P3 — Detalhamento

#### GAP-014: Validação de Interoperabilidade
- **Ação:** Criar testes de contrato para integrações externas
- **Frameworks:** e-PING
- **Critério de aceite:** 100% das integrações com testes de contrato

#### GAP-015: Documentação de API Pública
- **Ação:** Gerar OpenAPI spec e publicar em `docs/api/`
- **Frameworks:** e-PING
- **Critério de aceite:** Spec OpenAPI 3.x disponível e validada

---

## Referências

- [ADR-001: Governança de Compliance GovTech](../architecture/decisions/ADR-001-governanca-de-compliance.md)
- [Manifesto Operacional](../../governance/MANIFESTO-OPERACIONAL.yaml)
- [Índice de ADRs](../architecture/decisions/README.md)
- [e-PING — Padrões de Interoperabilidade](https://www.gov.br/governodigital/pt-br/estrategias-e-governanca-digital/interoperabilidade)
- [e-ARQ Brasil](https://www.gov.br/arquivonacional/pt-br/servicos/gestao-de-documentos/orientacao-tecnica-1/e-arq-brasil)
- [LGPD — Lei nº 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [LAI — Lei nº 12.527/2011](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm)
