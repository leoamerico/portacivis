# SMOKE-AMPARO-VALIDATION

Data: 2026-03-04T22:25:55.451Z
Base URL: https://www.portacivis.com.br
Município fixo: **AMPARO/SP**
CorrelationId: amparo-corr-1772663155451
TraceId: amparo-trace-1772663155451

- [1] VERIFY_BEFORE: HTTP 200
  head_before: 8f93e0de455ef798...
- [2] AUDIT_POST (AMPARO/SP): HTTP 200
  hash: 30015aef519e9c92...
  deduplicated: false
- [3] VERIFY_AFTER: HTTP 200
  head_after: 30015aef519e9c92...
- [4] TRAIL_PAGE (AMPARO/SP): HTTP 200
- [5] AUDIT_PAGE: HTTP 200
- [6] IDEMPOTENCY (replay): HTTP 200
  deduplicated: true

## Resultado: ✅ PASS

| Campo | Valor |
|---|---|
| Município | AMPARO/SP |
| Camadas | public_services, alerts, compliance |
| head_before | `8f93e0de455ef798...` |
| head_after | `30015aef519e9c92...` |
| correlationId | `amparo-corr-1772663155451` |
| traceId | `amparo-trace-1772663155451` |
