# ADR-001: Adoção de Framework Híbrido GovTech para Governança

## Status

Aceito

## Contexto

O PortaCivis é um portal cívico que opera sob obrigações legais e regulatórias
brasileiras, incluindo:

- **e-PING** (Padrões de Interoperabilidade de Governo Eletrônico): exige
  conformidade com formatos abertos, protocolos padronizados e acessibilidade.
- **e-ARQ Brasil** (Modelo de Requisitos para Sistemas Informatizados de Gestão
  Arquivística de Documentos): define requisitos para rastreabilidade e
  preservação de registros digitais.
- **LGPD** (Lei Geral de Proteção de Dados — Lei 13.709/2018): impõe controles
  de privacidade, consentimento e tratamento de dados pessoais.
- **LAI** (Lei de Acesso à Informação — Lei 12.527/2011): exige transparência
  ativa e passiva para entidades que interagem com a administração pública.

Sem um framework de governança unificado, a plataforma corre risco de:

- Não conformidade fragmentada — cada camada gerenciando compliance de forma
  isolada.
- Ausência de rastreabilidade — decisões arquiteturais sem registro formal.
- Dificuldade de auditoria — impossibilidade de demonstrar conformidade a
  órgãos reguladores.
- Acúmulo de débito técnico de compliance — correções reativas em vez de
  estruturais.

A equipe avaliou três abordagens:

1. **TOGAF** (The Open Group Architecture Framework): framework internacional
   amplamente adotado em grandes empresas.
2. **ISO 38500** (Governança de TI): norma ISO focada em governança, sem
   especificidade para o contexto gov.br.
3. **Framework híbrido GovTech brasileiro**: combinação de COBIT (controles
   internos), padrões gov.br (e-PING, e-ARQ) e cloud best practices adaptados
   ao contexto público brasileiro.

## Decisão

O PortaCivis adota um **Framework Híbrido GovTech** como base de governança,
combinando:

- **COBIT 2019** para controles internos, gestão de riscos e objetivos de
  governança de TI.
- **Padrões gov.br** (e-PING, e-ARQ Brasil) como camada normativa primária,
  respeitando a soberania digital e a legislação brasileira.
- **Cloud Best Practices** (twelve-factor app, GitOps, policy-as-code) para
  operação moderna e rastreável.

A implementação segue três pilares:

1. **Policy as Code**: todas as políticas de compliance são expressas como
   código verificável em CI/CD (`governance/` e `.github/workflows/`).
2. **Quality Gates automatizados**: nenhum merge é permitido sem aprovação dos
   gates de segurança, i18n, build e governança.
3. **Compliance rastreável**: todas as decisões arquiteturais significativas
   são registradas como ADRs neste diretório, permitindo auditoria completa
   da evolução do sistema.

## Consequências

### Positivas

- Conformidade com e-PING, e-ARQ, LGPD e LAI tratada como requisito de
  engenharia, não como checklist manual.
- Rastreabilidade completa de decisões arquiteturais via ADRs versionados
  em Git.
- Quality gates no CI/CD previnem regressões de compliance.
- Alinhamento com padrões brasileiros facilita auditorias e licitações.
- Abordagem híbrida permite adotar boas práticas internacionais sem abrir
  mão das especificidades regulatórias nacionais.

### Negativas

- Overhead inicial de documentação (criação e manutenção de ADRs).
- Curva de aprendizado para novos colaboradores familiarizarem-se com os
  padrões gov.br.
- Validações de CI/CD adicionam tempo ao pipeline de entrega.

## Alternativas Consideradas

- **TOGAF**: framework robusto, mas excessivamente genérico e orientado a
  grandes corporações. Não contempla os requisitos específicos de e-PING,
  e-ARQ e LGPD. Adotá-lo isoladamente exigiria extensiva customização sem
  garantia de aderência às normas brasileiras.
- **ISO 38500**: foca em governança de alto nível (responsabilidade, estratégia,
  aquisição, desempenho, conformidade, comportamento humano), sem orientação
  técnica operacional. Insuficiente como único framework para um portal cívico
  com obrigações legais específicas.

## Referências

- [e-PING — Padrões de Interoperabilidade](https://www.gov.br/governodigital/pt-br/transformacao-digital/tecnologia/e-ping)
- [e-ARQ Brasil](https://www.gov.br/arquivonacional/pt-br/servicos/gestao-de-documentos/e-arq-brasil)
- [LGPD — Lei 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [LAI — Lei 12.527/2011](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm)
- [COBIT 2019](https://www.isaca.org/resources/cobit)
- [Dashboard de Compliance](../../governance/DASHBOARD-GAPS.md)
- [MANIFESTO-OPERACIONAL](../../../governance/MANIFESTO-OPERACIONAL.yaml)
