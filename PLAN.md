# Plano: Criação de Protocolo para Aprovação de Projetos via govevia-kernel

## Contexto

O portacivis possui infraestrutura de auditoria imutável (truth-trail), orquestração de contexto multi-agente, e registro de marca Govevia — mas **não possui integração com a API de documentos do govevia-kernel**. Este plano cria essa integração e disponibiliza a função de abertura de protocolo para aprovação de projetos.

---

## Etapa 1: Tipos de domínio (`src/protocol/types.ts`)

Criar o módulo de domínio com os tipos centrais:

```typescript
type ProtocolStatus = 'rascunho' | 'submetido' | 'em_analise' | 'aprovado' | 'rejeitado' | 'cancelado';

type ProjectProtocol = {
  protocolId: string;           // gerado localmente (prefixo "prot-")
  kernelDocumentId: string;     // ID retornado pelo govevia-kernel
  title: string;
  description: string;
  territory: { uf: string; cidade: string };
  requesterId: string;          // "visitor-anonymous" ou ID autenticado
  status: ProtocolStatus;
  layers: string[];             // áreas temáticas (compliance, services, etc.)
  createdAt: string;            // ISO 8601
  updatedAt: string;
  submittedAt?: string;
  kernelSyncedAt?: string;      // último sync com govevia-kernel
  attachments: ProtocolAttachment[];
  auditHash: string;            // hash da cadeia de auditoria
};

type ProtocolAttachment = {
  name: string;
  contentHash: string;
  mimeType: string;
  size: number;
};

type CreateProtocolRequest = {
  title: string;
  description: string;
  uf: string;
  cidade: string;
  layers?: string[];
  correlationId?: string;
  traceId?: string;
};

type KernelDocumentResponse = {
  documentId: string;
  protocolNumber: string;       // número oficial (ex: "PROT-2026-000123")
  status: string;
  createdAt: string;
};
```

---

## Etapa 2: Cliente govevia-kernel (`app/lib/goveviaKernel.ts`)

Criar cliente HTTP para a API de documentos do kernel, seguindo o padrão do projeto (fetch nativo, sem bibliotecas externas):

```
Funções exportadas:
- createKernelDocument(payload) → KernelDocumentResponse
- getKernelDocumentStatus(documentId) → status
- GOVEVIA_KERNEL_BASE_URL (via env var GOVEVIA_KERNEL_API_URL)
```

**Comportamento:**
- Se `GOVEVIA_KERNEL_API_URL` não estiver configurada, opera em modo offline (gera IDs locais com prefixo `local-`)
- Timeout de 5s por requisição
- Retry com backoff exponencial (2 tentativas)
- Registra falhas de comunicação no audit trail

---

## Etapa 3: Lógica de negócio (`app/lib/protocolManager.ts`)

Gerenciamento de protocolos com persistência em arquivo JSON (padrão do projeto):

```
Arquivo de dados: governance/protocols/protocols.json

Funções exportadas:
- createProtocol(request: CreateProtocolRequest) → ProjectProtocol
- getProtocol(protocolId: string) → ProjectProtocol | null
- listProtocols(filters?) → ProjectProtocol[]
- readProtocols() → Record<string, ProjectProtocol>
- writeProtocols(data) → void
```

**Fluxo de `createProtocol`:**
1. Validar campos obrigatórios (title, description, uf, cidade)
2. Gerar `protocolId` com `randomId('prot')`
3. Chamar `createKernelDocument()` para obter `kernelDocumentId`
4. Computar hash de auditoria via `sha256Hex`
5. Registrar evento `PROTOCOL_CREATED` na cadeia truth-trail
6. Persistir em `protocols.json`
7. Retornar protocolo criado

---

## Etapa 4: Rota API (`app/api/protocol/create/route.ts`)

```
POST /api/protocol/create

Request Body:
{
  "title": "Projeto de Mobilidade Urbana",
  "description": "Proposta para ciclovias na região central",
  "uf": "MG",
  "cidade": "Belo Horizonte",
  "layers": ["mobility", "compliance"],
  "correlationId": "...",    // opcional
  "traceId": "..."           // opcional
}

Response 200:
{
  "success": true,
  "protocol": { ...ProjectProtocol },
  "kernelProtocolNumber": "PROT-2026-000123"
}

Response 400: { "success": false, "error": "campo obrigatório ausente: title" }
Response 502: { "success": false, "error": "govevia-kernel indisponível", "protocol": { ...com status offline } }
```

Padrão: `export const runtime = 'nodejs'`, try-catch com fallback 500, validação manual.

---

## Etapa 5: Integração com audit trail

Registrar na cadeia truth-trail existente:

- **Evento**: `PROTOCOL_CREATED`
- **Payload hash**: SHA-256 do protocolo serializado
- **Campos**: correlationId, traceId, classification: 'publico'
- Reutilizar `recordContextAuditEvent()` de `app/lib/contextOrchestration.ts`

---

## Etapa 6: Traduções (3 locales)

Adicionar chaves em `messages/{pt-BR,en-US,es-ES}/common.json` dentro de um novo namespace `"protocol"`:

```
pt-BR:
- protocolTitle: "Abertura de Protocolo"
- protocolDescription: "Inicie o processo de aprovação do seu projeto"
- protocolCreated: "Protocolo aberto com sucesso"
- protocolNumber: "Número do protocolo: {number}"
- protocolStatus: "Situação: {status}"
- fieldTitle: "Título do projeto"
- fieldDescription: "Descrição"
- fieldTerritory: "Território"
- submitButton: "Abrir protocolo"
- kernelOffline: "Sistema de documentos temporariamente indisponível. Protocolo registrado localmente."

en-US / es-ES: equivalentes traduzidos
```

---

## Etapa 7: Página de abertura de protocolo (`app/protocolo/page.tsx`)

Componente server com formulário client para submissão:

- **Breadcrumb**: Início → Protocolo
- **Formulário** com campos: título, descrição, território (pré-preenchido se vier da trilha)
- **Submissão** via `fetch('/api/protocol/create')`
- **Feedback**: exibe número do protocolo e hash de verificação (truncado 16 chars)
- **Link para verificação**: direciona a `/verificacao-auditoria`

---

## Etapa 8: Navegação e links

- Adicionar link "Abrir Protocolo" na quicknav da trilha-da-verdade
- Adicionar na nav principal (`nav.protocol`)
- Incluir como quick path recomendado quando território estiver selecionado

---

## Arquivos a criar

| Arquivo | Tipo |
|---------|------|
| `src/protocol/types.ts` | Tipos de domínio |
| `app/lib/goveviaKernel.ts` | Cliente HTTP govevia-kernel |
| `app/lib/protocolManager.ts` | Lógica de negócio |
| `app/api/protocol/create/route.ts` | Rota API |
| `app/protocolo/page.tsx` | Página do formulário |
| `app/components/ProtocolForm.tsx` | Componente client do formulário |

## Arquivos a modificar

| Arquivo | Alteração |
|---------|-----------|
| `messages/pt-BR/common.json` | Namespace `protocol` |
| `messages/en-US/common.json` | Namespace `protocol` |
| `messages/es-ES/common.json` | Namespace `protocol` |
| `app/trilha-da-verdade/page.tsx` | Link na quicknav |
| `src/truthTrail/pathRecommendations.ts` | Quick path para protocolo |

## Variáveis de ambiente necessárias

| Variável | Descrição |
|----------|-----------|
| `GOVEVIA_KERNEL_API_URL` | URL base da API de documentos (ex: `https://kernel.govevia.gov.br/api/v1`) |
| `GOVEVIA_KERNEL_API_KEY` | Chave de autenticação (opcional, modo offline sem ela) |
