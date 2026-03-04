#!/usr/bin/env python3
from __future__ import annotations

import socket
import ssl
import sys
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

EXPECTED_A = "76.76.21.21"

@dataclass
class HttpCheck:
    url: str
    code: int | str
    location: str
    server: str
    content_type: str


def resolve_a(host: str) -> list[str]:
    addrs: set[str] = set()
    try:
        infos = socket.getaddrinfo(host, None, socket.AF_INET)
        for info in infos:
            addrs.add(info[4][0])
    except Exception:
        pass
    return sorted(addrs)


def head(url: str) -> HttpCheck:
    req = urllib.request.Request(url, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=20, context=ssl.create_default_context()) as resp:
            h = {k.lower(): v for k, v in resp.headers.items()}
            return HttpCheck(url, resp.getcode(), h.get("location", ""), h.get("server", ""), h.get("content-type", ""))
    except urllib.error.HTTPError as e:
        h = {k.lower(): v for k, v in e.headers.items()} if e.headers else {}
        return HttpCheck(url, e.code, h.get("location", ""), h.get("server", ""), h.get("content-type", ""))
    except Exception as e:
        return HttpCheck(url, f"ERR:{e}", "", "", "")


def main() -> int:
    checks = [
        "https://portacivis.com/",
        "https://portacivis.com/noticias",
        "https://portacivis.com/favicon.ico",
        "https://www.portacivis.com/",
        "https://www.portacivis.com/noticias",
        "https://www.portacivis.com/favicon.ico",
        "https://portacivis.com.br/",
        "https://portacivis.com.br/noticias",
        "https://portacivis.com.br/favicon.ico",
    ]

    dns_com = resolve_a("portacivis.com")
    dns_combr = resolve_a("portacivis.com.br")
    rows = [head(u) for u in checks]

    redirect_ok = True
    for row in rows:
        if row.url.startswith("https://portacivis.com"):
            if not (row.code == 301 and row.location.startswith("https://portacivis.com.br")):
                redirect_ok = False
        if row.url.startswith("https://www.portacivis.com"):
            if not (row.code == 301 and row.location.startswith("https://www.portacivis.com.br")):
                redirect_ok = False

    combr_ok = True
    for row in rows:
        if row.url.startswith("https://portacivis.com.br"):
            if row.url.endswith("/noticias") and row.code != 200:
                combr_ok = False
            if row.url.endswith("/favicon.ico") and row.code != 200:
                combr_ok = False

    dns_ok = EXPECTED_A in dns_com
    overall = dns_ok and redirect_ok and combr_ok

    out = Path("reports/PORTACIVIS-CANONICAL-RECHECK.md")
    out.parent.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    lines: list[str] = [
        "# PortaCivis — Recheck Canonical DNS/Redirect",
        "",
        f"- Executado em (UTC): {stamp}",
        f"- DNS A esperado para `.com`: `{EXPECTED_A}`",
        "",
        "## DNS",
        "",
        f"- `portacivis.com` A: {dns_com or ['(sem IPv4)']}",
        f"- `portacivis.com.br` A: {dns_combr or ['(sem IPv4)']}",
        f"- DNS `.com` alinhado com Vercel: {'SIM' if dns_ok else 'NÃO'}",
        "",
        "## HTTP (HEAD)",
        "",
        "| URL | Code | Location | Server | Content-Type |",
        "|---|---:|---|---|---|",
    ]

    for r in rows:
        lines.append(f"| {r.url} | {r.code} | {r.location or '-'} | {r.server or '-'} | {r.content_type or '-'} |")

    lines += [
        "",
        "## Conclusão",
        "",
        f"- `.com.br` saudável: {'SIM' if combr_ok else 'NÃO'}",
        f"- Redirect `.com` -> `.com.br`: {'SIM' if redirect_ok else 'NÃO'}",
        f"- Resultado geral: **{'PASS' if overall else 'FAIL'}**",
        "",
        "## Ação quando FAIL",
        "",
        "- No DNS do `portacivis.com`, ajustar `A @` para `76.76.21.21`.",
        "- Garantir `www.portacivis.com` apontando para Vercel (A 76.76.21.21 ou CNAME conforme painel Vercel).",
        "- Reexecutar este script até `PASS`.",
    ]

    out.write_text("\n".join(lines), encoding="utf-8")
    print(out.as_posix())
    print("OVERALL", "PASS" if overall else "FAIL")
    return 0 if overall else 2


if __name__ == "__main__":
    raise SystemExit(main())
