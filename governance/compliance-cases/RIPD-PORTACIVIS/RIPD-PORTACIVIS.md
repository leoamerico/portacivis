# RIPD — Relatório de Impacto à Proteção de Dados Pessoais
## PortaCivis — Portal Cívico de Informação Pública

**Versão:** 1.0  
**Data:** 2026-03-07  
**Controlador:** ENV NEO LTDA — CNPJ 36.207.211/0001-47  
**Encarregado (DPO):** dpo@envneo.com.br  
**Base legal:** Art. 38, Lei nº 13.709/2018 (LGPD)  
**Status:** Aprovado

---

## 1. Identificação do Controlador e do Encarregado

| Campo | Valor |
|---|---|
| Controlador | ENV NEO LTDA |
| CNPJ | 36.207.211/0001-47 |
| Encarregado (DPO) | dpo@envneo.com.br |
| Plataforma | PortaCivis — Portal Cívico de Informação Pública |
| URL canônica | https://www.portacivis.com.br |

---

## 2. Descrição do Tratamento (Art. 38, I)

O PortaCivis é um portal público digital que disponibiliza informações cívicas, notícias de interesse público e serviços digitais ao cidadão. As operações de tratamento de dados pessoais incluem:

1. **Logs de navegação técnica** — coleta mínima de IP de acesso, user agent e timestamps para garantia de segurança e integridade da plataforma.
2. **Registros de auditoria (Truth Trail)** — eventos imutáveis de ação com identificadores de ator, hashes de payload e correlação, para rastreabilidade e integridade de dados públicos.
3. **Canais de atendimento ao cidadão** — nome, e-mail e mensagem fornecidos voluntariamente pelo titular para exercício de direitos LGPD e atendimento institucional.
4. **Cadastro de usuário (quando aplicável)** — nome, CPF, e-mail e telefone para habilitação de serviços personalizados.
5. **Pesquisa de uso anonimizada** — métricas agregadas e anônimas para melhoria contínua do serviço público digital.

O inventário completo encontra-se em: `governance/LGPD-DATA-INVENTORY.yaml`.

---

## 3. Necessidade e Proporcionalidade (Art. 38, II)

### 3.1 Princípio da Finalidade

Cada categoria de dados está vinculada a uma finalidade explícita e legítima, conforme `governance/LGPD-DATA-INVENTORY.yaml`:

| Categoria | Finalidade | Base Legal |
|---|---|---|
| Identificação | Cadastro do cidadão | Consentimento |
| Autenticação | Segurança do serviço | Execução de contrato |
| Navegação técnica | Integridade e segurança do portal | Legítimo interesse |
| Logs de auditoria | Rastreabilidade e conformidade | Obrigação legal |
| Canais de atendimento | Atendimento ao titular | Consentimento |
| Pesquisa de uso anônima | Melhoria do serviço público | Legítimo interesse |

### 3.2 Princípio da Necessidade e Minimização

- Nenhum dado é coletado além do estritamente necessário para a finalidade declarada.
- Dados de navegação são coletados sem identificação individual sempre que possível.
- Pesquisa de uso é exclusivamente agregada — reidentificação é proibida por política.
- Perfilamento sensível de visitantes não é realizado.

### 3.3 Proporcionalidade

As retenções estão calibradas à finalidade:
- Logs de navegação técnica: 90 dias (duração mínima operacional)
- Logs de auditoria (Truth Trail): 1825 dias (5 anos — obrigação legal de arquivo público)
- Cadastro de cidadão: 1825 dias (5 anos — execução do serviço)
- Canais de atendimento: 365 dias (prazo legal de resposta a demandas)

---

## 4. Riscos Identificados (Art. 38, III)

### 4.1 Risco ALTO — Exposição de Dados de Navegação

| Atributo | Descrição |
|---|---|
| **Risco** | Exposição não autorizada de logs de IP e user agent |
| **Probabilidade** | Baixa |
| **Impacto** | Alto (privacidade do cidadão) |
| **Severidade** | Alta |
| **Vetor** | Acesso indevido a logs de infraestrutura |
| **Mitigação** | TLS em trânsito; logs retidos por apenas 90 dias; acesso restrito por controle de identidade; audit log de acessos |

### 4.2 Risco ALTO — Comprometimento da Cadeia de Auditoria (Truth Trail)

| Atributo | Descrição |
|---|---|
| **Risco** | Adulteração ou exclusão de registros de auditoria |
| **Probabilidade** | Muito baixa |
| **Impacto** | Alto (integridade institucional e conformidade legal) |
| **Severidade** | Alta |
| **Vetor** | Acesso privilegiado à base de dados |
| **Mitigação** | Cadeia append-only com hash encadeado; verificação de integridade via `scripts/smoke-truth-trail.mjs`; SLO de 100% de integridade |

### 4.3 Risco MÉDIO — Vazamento de Dados de Cadastro

| Atributo | Descrição |
|---|---|
| **Risco** | Exposição de nome, CPF, e-mail de cidadãos cadastrados |
| **Probabilidade** | Baixa |
| **Impacto** | Alto (danos diretos ao titular) |
| **Severidade** | Média |
| **Vetor** | Vulnerabilidade em API ou banco de dados |
| **Mitigação** | Criptografia em repouso; TLS em trânsito; testes de segurança em CI (`verify:all`); Content Security Policy; HSTS |

### 4.4 RISCO MÉDIO — Solicitações de Direitos sem Resposta Adequada

| Atributo | Descrição |
|---|---|
| **Risco** | Descumprimento de prazo legal de 15 dias para resposta ao titular |
| **Probabilidade** | Média |
| **Impacto** | Médio (sanção regulatória, dano reputacional) |
| **Severidade** | Média |
| **Vetor** | Ausência de canal formal ou processo inadequado |
| **Mitigação** | Canal DPO formalizado (dpo@envneo.com.br); processo documentado em RACI-OPERACAO.yaml; SLA de 15 dias |

### 4.5 RISCO BAIXO — Reidentificação de Pesquisa de Uso

| Atributo | Descrição |
|---|---|
| **Risco** | Reidentificação de usuários a partir de métricas de uso |
| **Probabilidade** | Muito baixa |
| **Impacto** | Baixo |
| **Severidade** | Baixa |
| **Vetor** | Correlação de dados agregados com fontes externas |
| **Mitigação** | Dados apenas agregados; sem cookies identificadores; política explícita de não reidentificação |

---

## 5. Medidas de Mitigação e Salvaguardas (Art. 38, IV)

### 5.1 Medidas Técnicas

| Medida | Descrição | Status |
|---|---|---|
| TLS em trânsito | HTTPS obrigatório com HSTS (2 anos) | ✅ Implementado |
| Criptografia em repouso | Dados sensíveis criptografados em banco | ✅ Implementado |
| Content Security Policy | CSP restritivo em todos os responses | ✅ Implementado |
| Rate limiting | Limite de requisições por IP | ✅ Implementado |
| Bcrypt para senhas | Hash seguro de credenciais | ✅ Implementado |
| Token com expiração | Sessões com TTL definido | ✅ Implementado |
| Audit trail imutável | Cadeia de hash para integridade de eventos | ✅ Implementado |
| Headers de segurança | X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy | ✅ Implementado |
| Smoke tests diários | Verificação contínua de segurança e disponibilidade | ✅ Implementado |

### 5.2 Medidas Organizacionais

| Medida | Descrição | Status |
|---|---|---|
| DPO nomeado | Encarregado formal designado (dpo@envneo.com.br) | ✅ Implementado |
| RACI de privacidade | Responsabilidades LGPD documentadas em RACI-OPERACAO.yaml | ✅ Implementado |
| Inventário de dados | LGPD-DATA-INVENTORY.yaml atualizado | ✅ Implementado |
| Canal de direitos | E-mail DPO visível na página de privacidade | ✅ Implementado |
| Política de retenção | Períodos definidos por categoria em LGPD-DATA-INVENTORY.yaml | ✅ Implementado |
| Resposta a incidentes | Procedimento em governance/SLO-RUNBOOK.yaml | ✅ Implementado |
| Notificação ANPD | Processo de notificação em até 72h documentado | ✅ Implementado |
| Treinamento de equipe | Responsabilidade formalizada no RACI | ✅ Implementado |

---

## 6. Compartilhamento com Terceiros

**Não há compartilhamento de dados pessoais com terceiros** para as operações atuais do PortaCivis.

Caso futuros parceiros ou processadores sejam adotados, este RIPD deverá ser atualizado e os contratos de processamento (DPA) elaborados conforme Art. 39 da LGPD.

---

## 7. Transferências Internacionais

**Não há transferências internacionais de dados pessoais** nas operações atuais do PortaCivis.

---

## 8. Conclusão sobre Adequação LGPD (Art. 38, V)

O tratamento de dados pessoais realizado pelo PortaCivis foi avaliado como **adequado aos requisitos da Lei nº 13.709/2018 (LGPD)**, com base nos seguintes fatores:

1. **Finalidade legítima e explícita** — todas as categorias de dados possuem finalidade declarada e base legal definida.
2. **Minimização** — coleta limitada ao estritamente necessário; perfilamento sensível proibido.
3. **Proporcionalidade** — retenções calibradas à finalidade e obrigações legais.
4. **Segurança** — medidas técnicas robustas implementadas e verificadas em CI/CD.
5. **Transparência** — política de privacidade pública com canal DPO visível.
6. **Exercício de direitos** — canal formal (dpo@envneo.com.br) com SLA de 15 dias.
7. **Governança** — DPO nomeado, RACI atualizado, inventário de dados mantido.

**Riscos residuais** identificados são classificados como baixos após aplicação das medidas de mitigação, e estão dentro do apetite ao risco definido para um portal de serviço público digital.

---

## 9. Revisões e Histórico

| Versão | Data | Autor | Descrição |
|---|---|---|---|
| 1.0 | 2026-03-07 | DPO — ENV NEO LTDA | Versão inicial — cobertura completa GAP-007, GAP-008, GAP-010 |

**Próxima revisão programada:** 2026-09-07 (6 meses)

---

*Este documento foi elaborado em conformidade com o Art. 38 da Lei nº 13.709/2018 (LGPD) e deve ser revisado sempre que houver alteração relevante nas operações de tratamento de dados pessoais.*
