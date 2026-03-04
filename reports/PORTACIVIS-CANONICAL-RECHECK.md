# PortaCivis — Recheck Canonical DNS/Redirect

- Executado em (UTC): 2026-03-04T05:19:27Z
- DNS A esperado para `.com`: `76.76.21.21`

## DNS

- `portacivis.com` A: ['13.248.243.5', '76.223.105.230']
- `portacivis.com.br` A: ['76.76.21.21']
- DNS `.com` alinhado com Vercel: NÃO

## HTTP (HEAD)

| URL | Code | Location | Server | Content-Type |
|---|---:|---|---|---|
| https://portacivis.com/ | 200 | - | DPS/2.0.0-beta+sha-f674e39 | text/html;charset=utf-8 |
| https://portacivis.com/noticias | 404 | - | DPS/2.0.0-beta+sha-f674e39 | text/html;charset=utf-8 |
| https://portacivis.com/favicon.ico | 404 | - | DPS/2.0.0-beta+sha-f674e39 | text/html;charset=utf-8 |
| https://www.portacivis.com/ | 200 | - | DPS/2.0.0-beta+sha-f674e39 | text/html;charset=utf-8 |
| https://www.portacivis.com/noticias | 404 | - | DPS/2.0.0-beta+sha-f674e39 | text/html;charset=utf-8 |
| https://www.portacivis.com/favicon.ico | 404 | - | DPS/2.0.0-beta+sha-f674e39 | text/html;charset=utf-8 |
| https://portacivis.com.br/ | 200 | - | Vercel | text/html; charset=utf-8 |
| https://portacivis.com.br/noticias | 200 | - | Vercel | text/html; charset=utf-8 |
| https://portacivis.com.br/favicon.ico | 200 | - | Vercel | image/x-icon |

## Conclusão

- `.com.br` saudável: SIM
- Redirect `.com` -> `.com.br`: NÃO
- Resultado geral: **FAIL**

## Ação quando FAIL

- No DNS do `portacivis.com`, ajustar `A @` para `76.76.21.21`.
- Garantir `www.portacivis.com` apontando para Vercel (A 76.76.21.21 ou CNAME conforme painel Vercel).
- Reexecutar este script até `PASS`.