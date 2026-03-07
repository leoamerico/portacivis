# ADR-001: Governança de Compliance GovTech

Status: Aceito
Data: 2026-03-07
Decisores: Leonardo Américo (Arquiteto), Env Neo

---

## Contexto

PortaCivis é um portal do cidadão que opera como solução GovTech e,
por isso, requer conformidade simultânea com múltiplos frameworks
regulatórios brasileiros:

- **e-PING** — Padrões de Interoperabilidade de Governo Eletrônico
- **e-ARQ Brasil** — Modelo de Requisitos para Sistemas Informatizados de Gestão Arquivística de Documentos
- **LGPD** — Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)
- **LAI** — Lei de Acesso à Informação (Lei nº 12.527/2011)

Sem um framework de governança estruturado, a conformidade com esses
requisitos tende a ser gerida de forma manual, informal e sujeita a
falhas — especialmente em ambientes de desenvolvimento ágil onde
mudanças ocorrem com frequência.

Adicionalmente, o projeto identificou 15 gaps de compliance ativos
(ver [Dashboard de Gaps](../../governance/DASHBOARD-GAPS.md)), com
conformidade atual em 47,5%, que precisam ser endereçados de forma
sistemática e rastreável.

---

## Decisão

Adotar um **framework híbrido GovTech** de governança de compliance
com os seguintes componentes:

1. **Policy as Code em YAML** — políticas de compliance definidas como
   artefatos versionados no repositório, em `governance/`.

2. **Quality Gates automatizados** — 15+ gates de validação integrados
   ao pipeline CI/CD, incluindo segurança, i18n, build e governance.

3. **CI/CD bloqueante para violações críticas** — PRs não podem ser
   mergeados se houver violações de gates obrigatórios.

4. **Documentação versionada no repositório** — toda decisão
   arquitetural, política e gap de conformidade é documentada como
   artefato Git rastreável.

5. **ADRs obrigatórias para decisões arquiteturais** — toda decisão
   significativa deve ser registrada em `docs/architecture/decisions/`
   seguindo o formato MADR.

6. **Dashboard de compliance** — painel consolidado em
   `docs/governance/DASHBOARD-GAPS.md` com status de todos os gaps,
   progresso de PRs e projeção de conformidade.

---

## Consequências

### Positivas

- Conformidade auditável e rastreável via histórico Git.
- Automação reduz significativamente o erro humano em validações.
- Deployment bloqueado automaticamente quando o sistema não está conforme.
- Novos membros da equipe podem entender o estado de compliance a partir da documentação.
- ADRs criam memória institucional e evitam repetição de decisões já avaliadas.

### Negativas

- Build time aumenta aproximadamente 30 segundos pelos quality gates adicionais.
- Requer manutenção contínua das políticas YAML conforme frameworks evoluem.
- Curva de aprendizado para a equipe sobre o processo de ADRs e quality gates.

### Neutras

- O repositório cresce em volume de documentação de governance.
- Pull Requests de arquitetura seguem fluxo mais formal do que PRs de produto.

---

## Alternativas Consideradas

### Alternativa 1: Compliance manual via checklists

Gerenciar conformidade através de checklists manuais preenchidos antes
de cada release.

- **Razão da rejeição:** Propenso a erro humano, não escalável com
  o crescimento da equipe, e não oferece rastreabilidade automatizada.
  Não atende ao requisito de auditabilidade do e-ARQ Brasil.

### Alternativa 2: Frameworks corporativos (TOGAF puro)

Adotar TOGAF como framework arquitetural principal com toda sua
estrutura de governance.

- **Razão da rejeição:** Muito pesado e burocrático para uma startup
  GovTech em fase inicial. O overhead de processo reduziria a
  velocidade de entrega sem benefício proporcional nesta fase.

### Alternativa 3: Ferramentas externas de GRC (Governance, Risk, Compliance)

Adotar uma plataforma SaaS de GRC para gerenciar compliance.

- **Razão da rejeição:** Custo elevado, dependência de terceiros para
  dados sensíveis, e desconexão do fluxo de desenvolvimento. A
  abordagem Policy as Code mantém compliance integrado ao ciclo de
  desenvolvimento.

---

## Referências

- [Dashboard de Gaps de Compliance](../../governance/DASHBOARD-GAPS.md)
- [Índice de ADRs](./README.md)
- [Manifesto Operacional](../../../governance/MANIFESTO-OPERACIONAL.yaml)
- [e-PING — Padrões de Interoperabilidade](https://www.gov.br/governodigital/pt-br/estrategias-e-governanca-digital/interoperabilidade)
- [e-ARQ Brasil](https://www.gov.br/arquivonacional/pt-br/servicos/gestao-de-documentos/orientacao-tecnica-1/e-arq-brasil)
- [LGPD — Lei nº 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [LAI — Lei nº 12.527/2011](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm)
- [MADR — Markdown Architectural Decision Records](https://adr.github.io/madr/)
