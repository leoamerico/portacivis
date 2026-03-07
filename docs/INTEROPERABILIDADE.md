# Interoperabilidade — PortaCivis

Documentação de conformidade com os padrões **e-PING** (Padrões de Interoperabilidade de Governo Eletrônico) para o Portal PortaCivis.

## Índice

1. [Visão Geral](#visão-geral)
2. [Especificação OpenAPI](#especificação-openapi)
3. [Dados Abertos (INDA)](#dados-abertos-inda)
4. [Endpoints de API](#endpoints-de-api)
5. [Conformidade e-PING](#conformidade-e-ping)
6. [Quality Gates](#quality-gates)
7. [Referências](#referências)

---

## Visão Geral

O PortaCivis implementa interoperabilidade conforme os padrões definidos pelo programa **e-PING** do Governo Federal, garantindo:

- APIs documentadas com **OpenAPI 3.0**
- Catálogo de dados abertos no padrão **DCAT/INDA**
- Endpoints versionados (`/api/v1/`)
- Segurança com **TLS 1.2+**, headers de segurança e autenticação JWT
- Formatos **JSON** e **JSON-LD** em todos os endpoints públicos

---

## Especificação OpenAPI

A especificação completa da API está disponível em:

| Formato | Local |
|---------|-------|
| YAML (fonte) | [`docs/api/openapi.yaml`](./api/openapi.yaml) |
| Servida estaticamente | `/docs/api/openapi.yaml` |
| Documentação interativa | [`/api/docs`](https://www.portacivis.com.br/api/docs) |

### Estrutura da especificação

```yaml
openapi: 3.0.3
info:
  title: PortaCivis API
  version: 1.0.0
servers:
  - url: https://www.portacivis.com.br/api/v1
paths:
  /dados-abertos/catalog: ...
  /servicos/consulta: ...
```

---

## Dados Abertos (INDA)

O catálogo de dados abertos segue o perfil **project-open-data v1.1** (compatível com DCAT-AP e INDA).

### Arquivos disponíveis

| Arquivo | URL | Descrição |
|---------|-----|-----------|
| `public/dados-abertos/catalog.json` | `/dados-abertos/catalog.json` | Catálogo estático DCAT/JSON-LD |

### Endpoint dinâmico

```
GET /api/v1/dados-abertos/catalog
```

Retorna o catálogo com data de modificação atualizada dinamicamente.

**Cabeçalhos de resposta:**
- `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`
- `X-Content-Type-Options: nosniff`
- `Access-Control-Allow-Origin: *`

### Estrutura do catálogo (DCAT)

```json
{
  "@context": "https://project-open-data.cio.gov/v1.1/schema/catalog.jsonld",
  "@type": "dcat:Catalog",
  "conformsTo": "https://project-open-data.cio.gov/v1.1/schema",
  "dataset": [
    {
      "@type": "dcat:Dataset",
      "title": "...",
      "description": "...",
      "issued": "YYYY-MM-DD",
      "modified": "YYYY-MM-DD",
      "publisher": { "name": "ENV NEO LTDA" },
      "distribution": [...],
      "license": "http://opendefinition.org/licenses/cc-by/"
    }
  ]
}
```

### Metadados obrigatórios (e-PMG)

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `title` | ✅ | Título do dataset |
| `description` | ✅ | Descrição do dataset |
| `issued` | ✅ | Data de publicação (ISO 8601) |
| `modified` | ✅ | Data de modificação (ISO 8601) |
| `publisher.name` | ✅ | Publicador |
| `distribution` | ✅ | Lista de distribuições |
| `license` | ✅ | Licença de uso (URI) |
| `keyword` | ✅ | Palavras-chave |
| `contactPoint` | ✅ | Ponto de contato |
| `spatial` | ✅ | Cobertura geográfica |
| `language` | ✅ | Idioma(s) |

---

## Endpoints de API

### Dados Abertos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/v1/dados-abertos/catalog` | Catálogo DCAT/JSON-LD | Público |

### Serviços (planejado)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/v1/servicos/consulta` | Lista serviços disponíveis | Público |

### Outros endpoints existentes

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `POST/GET` | `/api/context/select` | Seleção de contexto territorial | JWT |
| `GET` | `/api/context/status` | Status do contexto | JWT |
| `GET` | `/api/context/result` | Resultado do contexto | JWT |
| `POST` | `/api/context/cancel` | Cancelar contexto | JWT |
| `POST` | `/api/truth-trail/audit` | Registrar auditoria | JWT |
| `POST` | `/api/truth-trail/verify` | Verificar auditoria | JWT |

---

## Conformidade e-PING

O arquivo [`governance/E-PING-COMPLIANCE.yaml`](../governance/E-PING-COMPLIANCE.yaml) contém o checklist executável de conformidade com as seguintes categorias:

| Categoria | Itens | Status |
|-----------|-------|--------|
| Padrões de Web Services (REST) | 6 | ✅ Conforme |
| Metadados e-PMG | 10 | ✅ Conforme |
| Segurança (TLS 1.2+, headers) | 5 | ✅ Conforme |
| Formatos de dados (JSON, XML, CSV) | 3 | ✅ Conforme |
| Conformidade INDA | 5 | ✅ Conforme |

**GAPs atendidos:**
- **GAP-001**: Documentação de APIs conforme e-PING ✅
- **GAP-012**: Publicação de dados abertos (INDA) ✅

---

## Quality Gates

### `qg:opendata`

Valida o `catalog.json` e verifica conformidade INDA:

```bash
bun run qg:opendata
# ou
node scripts/validate-opendata.mjs
```

**O que é validado:**
- Arquivo `public/dados-abertos/catalog.json` é JSON válido
- Campos obrigatórios de topo (`@context`, `@type`, `conformsTo`, `dataset`)
- Para cada dataset: `title`, `description`, `issued`, `modified`, `publisher`, `distribution`, `license`
- Datas em formato ISO 8601
- Distribuições com `mediaType` e `accessURL` absolutos
- `@type` correto para catálogo e datasets

### Workflow de validação automática

O workflow [`.github/workflows/api-validation.yml`](../.github/workflows/api-validation.yml) executa automaticamente em PRs e pushes que modificam arquivos de API:

1. **Validate OpenAPI Schema** — valida sintaxe YAML e campos obrigatórios
2. **Validate Open Data Catalog (INDA)** — executa `qg:opendata`
3. **Validate e-PING Compliance YAML** — verifica que todos os itens estão em conformidade

---

## Referências

- [e-PING — Padrões de Interoperabilidade de Governo Eletrônico](https://www.gov.br/governodigital/pt-br/transformacao-digital/ferramentas/e-ping)
- [INDA — Infraestrutura Nacional de Dados Abertos](https://dados.gov.br/pagina/dados-abertos)
- [e-PMG — Padrão de Metadados do Governo](https://www.gov.br/governodigital/pt-br/transformacao-digital/ferramentas/e-pmg)
- [DCAT — Data Catalog Vocabulary](https://www.w3.org/TR/vocab-dcat-2/)
- [project-open-data schema v1.1](https://project-open-data.cio.gov/v1.1/schema)
- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3)
- [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
