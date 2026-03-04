# PortaCivis — Backlog Técnico Pronto para Sprint

Data: 2026-03-04

## Objetivo
Converter o relatório de consolidação em backlog executável para planejamento de sprint, com rastreabilidade de épicos, histórias e critérios de aceite.

## Artefatos gerados
- `reports/PORTACIVIS-BACKLOG-EXECUCAO-SMART-CITIES-B2G.md`
- `governance/BACKLOG-EXECUCAO.yaml`

## Uso recomendado no planejamento
1. Importar `governance/BACKLOG-EXECUCAO.yaml` na ferramenta de gestão (Jira/Azure Boards/Linear).
2. Planejar Sprint 0 com EPIC-00.
3. Executar Sprints 1-3 focando EPIC-01 e EPIC-02 para validação de receita.
4. Medir KPIs por fase antes de avançar para EPIC-03/EPIC-04.

## Gate operacional
Todas as histórias devem respeitar DoD com execução de `bun run verify:all` antes de fechamento.
