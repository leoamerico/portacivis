# PortaCivis

Portal do Cidadão: serviços, informações e transparência.

## Requisitos

- Node.js 20+
- npm

## Execução local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Segurança (fundação)

```bash
npm run security:headers
npm run security:verify
npm run test:smoke
```

- `security:headers`: valida presença de headers de segurança no `next.config.js`.
- `security:verify`: executa validação de segurança + build bloqueante.
- `test:smoke`: verifica saúde da URL canônica (`CANONICAL_URL`, padrão `https://portacivis.vercel.app`).

## Criar repositório no GitHub

Com GitHub CLI autenticado:

```bash
git init
git add .
git commit -m "chore: bootstrap portacivis portal"
git branch -M main
gh repo create portacivis --public --source . --remote origin --push
```

Sem GitHub CLI:

1. Crie o repositório `portacivis` no GitHub.
2. Execute:

```bash
git init
git add .
git commit -m "chore: bootstrap portacivis portal"
git branch -M main
git remote add origin https://github.com/<seu-usuario>/portacivis.git
git push -u origin main
```

## Conectar na Vercel

1. Vercel → `Add New Project` → importar `portacivis`.
2. Build command: `npm run build`.
3. Output framework: Next.js (auto).
4. Região: GRU (`gru1`).

## Domínios

No projeto Vercel, adicionar e configurar:

- `www.portacivis.com.br` (Primary)
- `portacivis.com.br` → 301 para `https://www.portacivis.com.br`
- `portacivis.com` → 301 para `https://www.portacivis.com.br`
- `www.portacivis.com` → 301 para `https://www.portacivis.com.br`
- `portacivis.online` → 301 para `https://www.portacivis.com.br`
- `www.portacivis.online` → 301 para `https://www.portacivis.com.br`
