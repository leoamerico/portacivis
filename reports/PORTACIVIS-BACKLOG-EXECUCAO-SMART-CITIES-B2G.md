# PortaCivis — Backlog de Execução (Smart Cities B2G)

Data: 2026-03-04  
Base: consolidação arquitetural e de negócio para evolução do portal em plataforma B2G.

---

## 1) Estrutura de Épicos

## EPIC-00 — Fundação de Plataforma e Governança
Objetivo: garantir base técnica, segurança, observabilidade e governança para escala.

### US-0001 — Ambiente e padrões de engenharia
- Como arquiteto, quero ambientes padronizados de dev/stage/prod para reduzir risco de drift.
- Critérios de aceite:
  - Ambientes documentados com variáveis por estágio.
  - Pipeline CI/CD com gates obrigatórios ativos.
  - Runbook de rollback publicado.

### US-0002 — Observabilidade mínima operacional
- Como SRE, quero logs/métricas/traces para detectar regressões rapidamente.
- Critérios de aceite:
  - Métricas de disponibilidade e erro em dashboard.
  - Alertas para falha de smoke diário e regressão de i18n.

### US-0003 — Governança executável
- Como líder técnico, quero manifesto/RACI/SLO validados em gate automático.
- Critérios de aceite:
  - `governance:verify` passa em CI.
  - Artefatos de governança versionados e referenciados no README.

---

## EPIC-01 — MVP Editorial + Captação
Objetivo: lançar produto com valor imediato para audiência e primeiros patrocinadores.

### US-0101 — Home e páginas editoriais por tema
- Como gestor público, quero navegar por categorias para encontrar conteúdo relevante.
- Critérios de aceite:
  - Home com destaques e categorias.
  - Busca por palavra-chave e filtro por tema.

### US-0102 — CMS headless integrado
- Como editor, quero publicar conteúdo sem depender de deploy.
- Critérios de aceite:
  - CRUD de matéria via CMS.
  - Fluxo mínimo draft/review/publish.

### US-0103 — Newsletter e captura de leads
- Como time comercial, quero capturar leads por formulário e newsletter.
- Critérios de aceite:
  - Formulário validado com consentimento.
  - Armazenamento e exportação de leads habilitados.

---

## EPIC-02 — Lead Generation B2G e CRM
Objetivo: transformar audiência em pipeline comercial qualificado.

### US-0201 — Formulários progressivos de conversão
- Como fornecedor, quero campanhas de download/webinar para captar interessados.
- Critérios de aceite:
  - Landing pages com campos progressivos.
  - Tracking de origem de campanha (UTM).

### US-0202 — Scoring de intenção
- Como comercial, quero score por lead para priorizar follow-up.
- Critérios de aceite:
  - Score calculado por comportamento.
  - Segmentação por persona e região.

### US-0203 — Integração CRM
- Como operação de marketing, quero sincronizar leads para automação.
- Critérios de aceite:
  - Integração com CRM definida (HubSpot/RD/Salesforce).
  - Retry e logging em falhas de sync.

---

## EPIC-03 — Comunidade Fechada e Matchmaking
Objetivo: elevar retenção e criar efeito de rede entre gestores e fornecedores.

### US-0301 — Área autenticada para gestores
- Como gestor público, quero acessar conteúdos e discussões exclusivas.
- Critérios de aceite:
  - Login seguro com papéis.
  - Controle de acesso por tipo de usuário.

### US-0302 — Fóruns e grupos temáticos
- Como comunidade, quero trocar práticas por tema/cidade.
- Critérios de aceite:
  - Threads por categoria.
  - Moderação e trilha de auditoria.

### US-0303 — Matchmaking de soluções
- Como gestor, quero conectar minha demanda a fornecedores compatíveis.
- Critérios de aceite:
  - Solicitação de demanda estruturada.
  - Lista de fornecedores recomendados por perfil.

---

## EPIC-04 — Inteligência B2G e Receita Premium
Objetivo: criar produtos de alto valor com dados e benchmark.

### US-0401 — Data lake de engajamento + dados públicos
- Como analista, quero unificar dados para gerar inteligência acionável.
- Critérios de aceite:
  - Ingestão de eventos e dados públicos automatizada.
  - Catálogo de dados documentado.

### US-0402 — Dashboards premium
- Como assinante, quero acessar relatórios avançados por tema/região.
- Critérios de aceite:
  - Painéis com KPIs por segmento municipal.
  - Exportação controlada (CSV/PDF).

### US-0403 — Assinatura e controle de acesso premium
- Como operação de produto, quero monetizar relatórios exclusivos.
- Critérios de aceite:
  - Planos e paywall operacionais.
  - Controle de acesso granular por assinatura.

---

## 2) Priorização (WSJF simplificado)

1. EPIC-00 Fundação  
2. EPIC-01 MVP Editorial + Captação  
3. EPIC-02 Lead + CRM  
4. EPIC-03 Comunidade  
5. EPIC-04 Inteligência Premium

Critério aplicado: maior valor imediato com menor risco técnico e dependência.

---

## 3) Plano de Sprints (2 semanas cada)

## Sprint 0
- US-0001, US-0003 (base de governança e pipeline)
- Saída: fundação validada, sem bloqueios críticos de engenharia.

## Sprint 1
- US-0101, US-0102 (portal editorial e CMS)
- Saída: publicação operacional de conteúdo.

## Sprint 2
- US-0103, US-0201 (leads básicos e landing pages)
- Saída: primeiros funis de captação ativos.

## Sprint 3
- US-0202, US-0203 (scoring e CRM)
- Saída: pipeline comercial qualificado.

## Sprint 4
- US-0301, US-0302 (comunidade autenticada)
- Saída: retenção e engajamento da base de gestores.

## Sprint 5+
- US-0303, US-0401/0402/0403 conforme validação de receita.

---

## 4) Dependências Críticas

- Decisão de stack CMS (Strapi/Contentful/Sanity).
- Decisão de CRM e contrato de integração.
- Política de identidade para área fechada (Keycloak/Auth0/Cognito).
- Estratégia de dados (lake + BI + governança LGPD).

---

## 5) Definition of Done (DoD)

Uma história só é concluída quando:
- critério funcional validado;
- testes automatizados existentes passam (`verify:all`);
- segurança e governança sem regressão;
- documentação de operação atualizada;
- evidência registrada em `reports/`.

---

## 6) KPIs por fase

### MVP
- Visitantes qualificados/mês
- CTR de conteúdos estratégicos
- Conversão de formulário

### Lead Engine
- MQLs por segmento
- Taxa de aceitação comercial
- Tempo médio de follow-up

### Comunidade
- MAU da área fechada
- Participação em discussões
- Matchmaking concluído

### Premium
- Receita recorrente
- Churn de assinantes
- Uso de dashboards
