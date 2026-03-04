# PortaCivis — Status Consolidado Final

- Executado em (UTC): 2026-03-04T12:38:52Z

## Resultado executivo

- CSP (.com.br): **PASS**
- Favicon (.com.br): **PASS**
- Canonical `.com` -> `.com.br`: **PENDENTE (DNS externo)**
- Status funcional do portal `.com.br`: **PASS**

## Evidências HTTP (HEAD)

| URL | Code | Server | Content-Type | Location |
|---|---:|---|---|---|
| https://portacivis.com.br/ | 200 | Vercel | text/html; charset=utf-8 | - |
| https://www.portacivis.com.br/ | 200 | Vercel | text/html; charset=utf-8 | - |
| https://portacivis.com.br/favicon.ico | 200 | Vercel | image/x-icon | - |
| https://www.portacivis.com.br/favicon.ico | 200 | Vercel | image/x-icon | - |
| https://portacivis.com/ | 200 | DPS/2.0.0-beta+sha-f674e39 | text/html;charset=utf-8 | - |
| https://www.portacivis.com/ | 200 | DPS/2.0.0-beta+sha-f674e39 | text/html;charset=utf-8 | - |

## Evidências DNS

- `portacivis.com` A: ['13.248.243.5', '76.223.105.230']
- `portacivis.com.br` A: ['76.76.21.21']

## Conclusão

- Os erros reportados de CSP (font/script) e favicon 404 no `.com.br` estão corrigidos em produção.
- A canonicalização do `.com` depende de ajuste DNS fora do app: `A @ -> 76.76.21.21` e `www` apontando para Vercel.