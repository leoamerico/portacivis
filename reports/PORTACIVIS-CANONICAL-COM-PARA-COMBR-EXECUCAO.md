# PortaCivis — Canonicalização `.com` -> `.com.br` (Execução)

- Data (UTC): 2026-03-04
- Escopo: padronizar `portacivis.com` e `www.portacivis.com` para redirecionar a `.com.br`.

## Alteração aplicada no código

- Arquivo alterado: `D:/portacivis/next.config.js`
- Regra adicionada: redirects por host para:
  - `portacivis.com` -> `https://portacivis.com.br/:path*`
  - `www.portacivis.com` -> `https://www.portacivis.com.br/:path*`

## Deploy

- Deploy de produção executado com Vercel CLI (projeto `envneo/portacivis`).

## Evidências técnicas

### Status do `.com.br` (OK)
- `https://portacivis.com.br/` -> 200
- `https://portacivis.com.br/noticias` -> 200
- `https://portacivis.com.br/favicon.ico` -> 200
- `https://www.portacivis.com.br/*` -> 200

### Status do `.com` (bloqueado por DNS atual)
- `https://portacivis.com/` -> 200 (Server: `DPS/...`, não Vercel)
- `https://portacivis.com/noticias` -> 404
- `https://portacivis.com/favicon.ico` -> 404
- DNS atual de `portacivis.com` resolve para `76.223.105.230` e `13.248.243.5` (não Vercel).

## Conclusão

- Resultado: **PARCIAL**.
- O redirect está implementado no app e ativo para tráfego que chega na Vercel.
- O apex `.com` ainda não entra na Vercel por configuração DNS externa, portanto não pode ser redirecionado pelo app neste estado.

## Ação necessária (painel DNS)

No provedor DNS do `portacivis.com`:
1. Ajustar `A @` para `76.76.21.21` (Vercel) **ou** seguir o target exato mostrado na tela de domínio da Vercel para apex.
2. Ajustar `CNAME www` para `cname.vercel-dns.com` (ou target equivalente da Vercel).
3. Após propagação, validar:
   - `https://portacivis.com/` -> 301 para `https://portacivis.com.br/`
   - `https://portacivis.com/noticias` -> 301 para `https://portacivis.com.br/noticias`
   - `https://portacivis.com/favicon.ico` -> 301 para `https://portacivis.com.br/favicon.ico`
