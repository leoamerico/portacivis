# Mapa de Contexto + Orquestração Multiagente

Status: Draft (implementação incremental)
Data: 2026-03-04
Escopo: Home e Trilha da Verdade (contexto territorial, pré-aquecimento, resposta em duas fases)

## 1) Objetivo

Definir o contrato técnico para evoluir a experiência territorial do PortaCivis com:

1. Mapa geográfico real (base pública/open data);
2. Camadas temáticas ativáveis por assunto;
3. Evento único de contexto (`context_selected`) como gatilho de orquestração;
4. Pré-aquecimento de agentes por município/tema;
5. Resposta em duas fases:
   - Fase A (rápida): resumo objetivo em até ~2s;
   - Fase B (consolidada): visão ampliada com evidências e próximos atos;
6. Registro auditável na Truth Trail.

## 2) Princípios de Produto

- Tempo para valor: o usuário recebe utilidade antes de terminar de explorar a tela.
- Contexto primeiro: localização + tema dirigem linguagem, prioridade e recomendações.
- Progressivo: o sistema começa com pouco dado e melhora conforme o usuário interage.
- Auditável por padrão: cada decisão contextual gera trilha verificável.

## 3) Entidades de Contexto

### 3.1 Contexto Territorial

```json
{
  "country": "BR",
  "state": "SP",
  "city": "São Paulo",
  "cityCode": "3550308",
  "lat": -23.5505,
  "lng": -46.6333,
  "zoom": 8,
  "source": "map_click | search | geolocation"
}
```

### 3.2 Camada Temática

```json
{
  "layerId": "public_services",
  "label": "Serviços Públicos",
  "enabled": true,
  "priority": 2
}
```

Camadas mínimas do MVP:
- `news_signals`
- `public_services`
- `compliance`
- `mobility`
- `alerts`

### 3.3 ContextKey (chave de cache)

```
contextKey = sha256(country|state|cityCode|sorted(layerIds)|language)
```

## 4) Evento Canônico

## 4.1 `context_selected`

Evento único para sincronizar UI, backend e orquestrador.

```json
{
  "eventType": "context_selected",
  "traceId": "uuid",
  "timestamp": "2026-03-04T12:34:56Z",
  "locale": "pt-BR",
  "context": {
    "country": "BR",
    "state": "SP",
    "city": "São Paulo",
    "cityCode": "3550308",
    "lat": -23.5505,
    "lng": -46.6333,
    "source": "map_click"
  },
  "layers": ["public_services", "alerts"],
  "ui": {
    "surface": "home_map",
    "sessionId": "uuid"
  }
}
```

Regras:
- Deve ser idempotente por `(traceId, eventType)`.
- Deve gerar registro Truth Trail no backend.
- Deve disparar pré-aquecimento assíncrono sem bloquear Fase A.

## 5) Fluxo de Resposta em Duas Fases

## 5.1 Fase A (Quick Insight)

SLA alvo: P95 <= 2.0s

Entrada: `context_selected`.
Saída mínima:

```json
{
  "traceId": "uuid",
  "phase": "A",
  "summary": "No seu município há 2 alertas ativos e 1 serviço crítico com fila elevada.",
  "highlights": [
    "Alerta de abastecimento em 2 bairros",
    "Tempo médio de espera acima da meta"
  ],
  "recommendedActions": [
    "Ver serviços prioritários",
    "Abrir trilha de verificação"
  ],
  "confidence": 0.82,
  "expiresAt": "2026-03-04T12:39:56Z"
}
```

## 5.2 Fase B (Deep Context)

SLA alvo: P95 <= 12s

Entrada: mesmo `traceId` da Fase A.
Saída mínima:

```json
{
  "traceId": "uuid",
  "phase": "B",
  "panorama": {
    "services": [...],
    "alerts": [...],
    "compliance": [...],
    "mobility": [...]
  },
  "evidence": [
    {
      "title": "Fonte oficial X",
      "url": "https://...",
      "collectedAt": "2026-03-04T12:35:02Z"
    }
  ],
  "nextActs": [
    "Registrar manifestação",
    "Iniciar verificação de política pública"
  ],
  "audit": {
    "truthTrailHash": "sha256...",
    "chainPosition": 1234
  }
}
```

## 6) Contratos de API

Base sugerida: `/api/context`

### 6.1 POST `/api/context/select`

Função: receber contexto selecionado e devolver Fase A imediatamente.

Request:

```json
{
  "traceId": "uuid",
  "locale": "pt-BR",
  "context": { "country": "BR", "state": "SP", "cityCode": "3550308" },
  "layers": ["public_services", "alerts"],
  "source": "home_map"
}
```

Response 200 (Fase A):

```json
{
  "traceId": "uuid",
  "phase": "A",
  "summary": "...",
  "highlights": [],
  "recommendedActions": [],
  "prewarm": {
    "jobId": "uuid",
    "status": "started"
  }
}
```

### 6.2 GET `/api/context/status?traceId=...`

Função: status do pré-aquecimento e da Fase B.

Response 200:

```json
{
  "traceId": "uuid",
  "phaseA": "ready",
  "phaseB": "running | ready | failed",
  "progress": 65,
  "agents": {
    "news": "done",
    "services": "running",
    "compliance": "queued",
    "mobility": "done"
  }
}
```

### 6.3 GET `/api/context/result?traceId=...`

Função: retornar payload consolidado da Fase B quando disponível.

Response 200: objeto de Fase B.

### 6.4 POST `/api/context/cancel`

Função: cancelar job em andamento se usuário trocar cidade/camada.

## 7) Orquestração de Agentes

Agentes mínimos:
- `news-agent`
- `services-agent`
- `compliance-agent`
- `mobility-agent`

Regras de execução:
1. Start paralelo após Fase A emitida;
2. Timeout por agente: 8s (MVP);
3. Retry único em falha transitória;
4. Resposta parcial permitida (não bloquear entrega da Fase B);
5. Ordenação de merge por prioridade de camada + relevância local.

Pseudo-fluxo:

1. Receive `context_selected`;
2. Resolve `contextKey` e tenta cache;
3. Se hit: retorna Fase A e Fase B imediata;
4. Se miss: gera Fase A por resumo rápido;
5. Dispara fan-out de agentes;
6. Faz merge estruturado;
7. Persiste auditoria e cache;
8. Disponibiliza Fase B.

## 8) Cache e Degradação

Estratégia:
- Cache L1 (memória): 5 min por `contextKey`;
- Cache L2 (persistente): 30 min por `contextKey`;
- Invalidação imediata em alerta crítico.

Fallbacks:
- Sem dados de mobilidade: omitir seção e sinalizar indisponibilidade.
- Falha de um agente: Fase B parcial + `warnings`.
- Falha geral: manter Fase A + CTA para reprocessamento.

## 9) Truth Trail (Auditabilidade)

Cada ciclo `context_selected` deve registrar:
- `traceId`
- `contextHash`
- camadas solicitadas
- agentes executados e status
- hashes de entrada/saída
- timestamp de início/fim

Integração esperada com endpoints existentes de auditoria/verificação.

## 10) UX States (MVP)

Estados no cliente:
- `idle`
- `selecting_context`
- `phase_a_ready`
- `phase_b_running`
- `phase_b_ready`
- `phase_b_partial`
- `error`

Comportamento:
- Mostrar resumo rápido assim que Fase A chegar;
- Exibir progresso de agentes durante Fase B;
- Atualizar painel sem reset brusco da tela;
- Se cidade mudar, cancelar job anterior e iniciar novo.

## 11) Métricas de Sucesso

- P95 Fase A <= 2.0s
- P95 Fase B <= 12s
- Taxa de resposta parcial <= 15%
- CTR em `recommendedActions` >= 20%
- Taxa de erro de orquestração <= 2%

## 12) Plano de Entrega (Incremental)

Fase 1 (infra de contrato):
- Criar endpoints `/api/context/*` com mocks determinísticos;
- Emitir `traceId` e registrar Truth Trail por seleção;
- Implementar estados de UI para duas fases.

Fase 2 (agentes reais):
- Ligar 2 agentes (serviços + alertas);
- Cache L1 ativo;
- Fase B parcial habilitada.

Fase 3 (escala temática):
- Ligar todos os agentes do MVP;
- Cache L2 + invalidação crítica;
- Observabilidade completa (latência por agente e por cidade).

## 13) Critérios de Aceite

1. Seleção de município/camadas retorna Fase A em <= 2s (P95 local de teste).
2. Fase B chega sem bloquear navegação e com rastreabilidade (`traceId` + hash).
3. Troca de contexto cancela execução anterior corretamente.
4. Falha de agente isolado não quebra resposta final.
5. Registro auditável acessível pelos endpoints de verificação/auditoria.
