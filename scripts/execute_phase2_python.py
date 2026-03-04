#!/usr/bin/env python3
from __future__ import annotations

import datetime as dt
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "reports" / "PORTACIVIS-MIGRACAO-ISONOMIA-FASE2-PYTHON-EXECUCAO.md"

LOCAL_URLS = [
    "http://localhost:3000/noticias",
    "http://localhost:3000/favicon.ico",
]
PROD_URLS = [
    "https://www.portacivis.com.br/",
    "https://www.portacivis.com.br/agentes",
    "https://www.portacivis.com.br/noticias",
    "https://www.portacivis.com.br/favicon.ico",
]


def run(cmd: list[str], cwd: Path) -> tuple[int, str]:
    if os.name == "nt":
        proc = subprocess.run(" ".join(cmd), cwd=cwd, shell=True, capture_output=True, text=True)
    else:
        proc = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    out = (proc.stdout or "") + ("\n" + proc.stderr if proc.stderr else "")
    return proc.returncode, out.strip()


def head_status(url: str, timeout: int = 15) -> tuple[int, str]:
    req = urllib.request.Request(url=url, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            ct = resp.headers.get("Content-Type", "")
            return resp.status, ct
    except urllib.error.HTTPError as err:
        ct = err.headers.get("Content-Type", "") if err.headers else ""
        return err.code, ct
    except Exception:
        return 0, ""


def wait_local(url: str, retries: int = 30, delay: float = 1.0) -> tuple[int, str]:
    for _ in range(retries):
        code, ct = head_status(url)
        if code in (200, 301, 302, 404):
            return code, ct
        time.sleep(delay)
    return 0, ""


def main() -> int:
    timestamp = dt.datetime.now(dt.timezone.utc).isoformat()
    lines: list[str] = [
        "# PortaCivis — Execução Fase 2 via Python",
        "",
        f"- Executado em: {timestamp}",
        f"- Diretório: `{ROOT.as_posix()}`",
        "",
        "## 1) Build via Python",
        "",
    ]

    build_code, build_out = run(["npm", "run", "build"], ROOT)
    lines.append(f"- Build status: **{'PASS' if build_code == 0 else 'FAIL'}**")
    lines.append("")
    lines.append("```text")
    lines.append(build_out[-4000:] if build_out else "(sem saída)")
    lines.append("```")
    lines.append("")

    if os.name == "nt":
        dev_proc = subprocess.Popen(
            "npm run dev",
            cwd=ROOT,
            shell=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    else:
        dev_proc = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=ROOT,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

    time.sleep(4)
    lines.append("## 2) Smoke local (servidor iniciado por Python)")
    lines.append("")

    local_fail = False
    for url in LOCAL_URLS:
        code, ct = wait_local(url)
        ok = code == 200
        if not ok:
            local_fail = True
        lines.append(f"- {url} -> `{code}` ({'PASS' if ok else 'FAIL'}) content-type=`{ct}`")

    try:
        dev_proc.terminate()
        dev_proc.wait(timeout=8)
    except Exception:
        dev_proc.kill()

    lines.append("")
    lines.append("## 3) Snapshot produção (HEAD)")
    lines.append("")

    for url in PROD_URLS:
        code, ct = head_status(url)
        status = "PASS" if code == 200 else ("WARN" if code in (301, 302, 404) else "FAIL")
        lines.append(f"- {url} -> `{code}` ({status}) content-type=`{ct}`")

    lines.append("")
    lines.append("## 4) Resultado")
    lines.append("")
    lines.append(f"- Execução Python local: **{'PASS' if not local_fail and build_code == 0 else 'FAIL'}**")
    lines.append("- Observação: produção depende de deploy/promote para refletir mudanças locais.")

    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"Report generated: {REPORT.as_posix()}")
    return 1 if (build_code != 0 or local_fail) else 0


if __name__ == "__main__":
    raise SystemExit(main())
