# PortaCivis — Execução Fase 2 via Python

- Executado em: 2026-03-04T05:07:23.313690+00:00
- Diretório: `D:/portacivis`

## 1) Build via Python

- Build status: **PASS**

```text
> portacivis-portal@1.0.0 build
> next build

   â–² Next.js 15.5.12

   Creating an optimized production build ...
 âœ“ Compiled successfully in 1062ms
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (0/11) ...
   Generating static pages (2/11) 
   Generating static pages (5/11) 
   Generating static pages (8/11) 
 âœ“ Generating static pages (11/11)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS
â”Œ â—‹ /                                      165 B         106 kB
â”œ â—‹ /_not-found                            993 B         103 kB
â”œ â—‹ /accessibilidade                       137 B         102 kB
â”œ â—‹ /agentes                               137 B         102 kB
â”œ â—‹ /conformidade                          137 B         102 kB
â”œ â—‹ /cookies-e-cache                       137 B         102 kB
â”œ â—‹ /noticias                              165 B         106 kB
â”œ â—‹ /privacidade                           137 B         102 kB
â”” â—‹ /termos                                137 B         102 kB
+ First Load JS shared by all             102 kB
  â”œ chunks/255-ebd51be49873d76c.js         46 kB
  â”œ chunks/4bd1b696-c023c6e3521b1417.js  54.2 kB
  â”” other shared chunks (total)          1.99 kB


â—‹  (Static)  prerendered as static content
```

## 2) Smoke local (servidor iniciado por Python)

- http://localhost:3000/noticias -> `404` (FAIL) content-type=`text/html; charset=utf-8`
- http://localhost:3000/favicon.ico -> `200` (PASS) content-type=`image/x-icon`

## 3) Snapshot produção (HEAD)

- https://www.portacivis.com.br/ -> `200` (PASS) content-type=`text/html; charset=utf-8`
- https://www.portacivis.com.br/agentes -> `200` (PASS) content-type=`text/html; charset=utf-8`
- https://www.portacivis.com.br/noticias -> `404` (WARN) content-type=`text/html; charset=utf-8`
- https://www.portacivis.com.br/favicon.ico -> `404` (WARN) content-type=`text/html; charset=utf-8`

## 4) Resultado

- Execução Python local: **FAIL**
- Observação: produção depende de deploy/promote para refletir mudanças locais.
