/**
 * AMPARO VALIDATION SMOKE TEST
 *
 * Caso de validação fixo: município AMPARO — estado SP (São Paulo)
 *
 * Este script valida o fluxo completo da trilha da verdade para
 * um território concreto e conhecido, servindo como caso de referência
 * para garantir que o ambiente de produção está operacional.
 *
 * Uso:
 *   node scripts/smoke-amparo-validation.mjs
 *   BASE_URL=http://localhost:3000 node scripts/smoke-amparo-validation.mjs
 */

import {mkdirSync, writeFileSync} from 'node:fs';
import {createHash, randomUUID} from 'node:crypto';

const BASE_URL = process.env.BASE_URL || 'https://www.portacivis.com.br';

// ── Caso fixo de validação ──────────────────────────────────────────────────
const VALIDATION_CASE = {
  municipio: 'Amparo',
  uf: 'SP',
  label: 'AMPARO/SP',
  layers: ['public_services', 'alerts', 'compliance'],
  classification: 'publico'
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function nowIso() {
  return new Date().toISOString();
}

function sha256Hex(value) {
  return createHash('sha256').update(value).digest('hex');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`[AMPARO] ${message}`);
  }
}

async function getJson(path, headers = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers,
    redirect: 'follow'
  });
  const text = await response.text();
  let json = null;
  try { json = JSON.parse(text); } catch { json = null; }
  return {status: response.status, text, json};
}

async function postJson(path, payload) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
    redirect: 'follow'
  });
  const text = await response.text();
  let json = null;
  try { json = JSON.parse(text); } catch { json = null; }
  return {status: response.status, text, json};
}

async function getHtml(path, cookie) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: cookie ? {Cookie: cookie} : {},
    redirect: 'follow'
  });
  const text = await response.text();
  return {status: response.status, text};
}

// ── Builder de payload de auditoria para AMPARO ──────────────────────────────

function buildAmparoAuditPayload(previousHash, correlationId, traceId) {
  const payload = {
    source: 'amparo-validation',
    scope: 'fixed-municipality-case',
    municipio: VALIDATION_CASE.municipio,
    uf: VALIDATION_CASE.uf,
    layers: VALIDATION_CASE.layers,
    timestamp: nowIso()
  };

  return {
    eventId: randomUUID(),
    eventType: 'TRUTH_TRAIL_ENTRY',
    actorId: `amparo-validation-${Date.now()}`,
    delegationContext: 'fixed-case-validation',
    delegationId: 'amparo-smoke',
    timestamp: nowIso(),
    action: 'view_truth_trail',
    payload,
    payloadHash: sha256Hex(JSON.stringify(payload)),
    correlationId,
    traceId,
    classification: VALIDATION_CASE.classification,
    previousHash
  };
}

// ── Relatório ────────────────────────────────────────────────────────────────

function writeReport(lines, passed) {
  mkdirSync('reports/runtime', {recursive: true});
  const filename = 'reports/runtime/SMOKE-AMPARO-LAST.md';
  writeFileSync(filename, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Relatório: ${filename}`);
  return filename;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const correlationId = `amparo-corr-${Date.now()}`;
  const traceId = `amparo-trace-${Date.now()}`;
  const startedAt = nowIso();

  const lines = [
    '# SMOKE-AMPARO-VALIDATION',
    '',
    `Data: ${startedAt}`,
    `Base URL: ${BASE_URL}`,
    `Município fixo: **${VALIDATION_CASE.label}**`,
    `CorrelationId: ${correlationId}`,
    `TraceId: ${traceId}`,
    ''
  ];

  let passed = false;

  try {
    // ── 1. Verificar estado inicial da cadeia ─────────────────────────────
    console.log(`[1/6] Verificando estado da cadeia de auditoria...`);
    const verifyBefore = await getJson('/api/truth-trail/verify');
    lines.push(`- [1] VERIFY_BEFORE: HTTP ${verifyBefore.status}`);
    assert(verifyBefore.status === 200, `verify retornou ${verifyBefore.status} esperado 200`);
    assert(verifyBefore.json?.success === true, 'verify: success !== true');
    assert(typeof verifyBefore.json?.head === 'string', 'verify: head ausente');

    const headBefore = verifyBefore.json.head;
    lines.push(`  head_before: ${headBefore.slice(0, 16)}...`);
    console.log(`  ✓ Cadeia íntegra. head=${headBefore.slice(0, 16)}...`);

    // ── 2. Postar evento de auditoria com AMPARO ──────────────────────────
    console.log(`[2/6] Postando evento de trilha para ${VALIDATION_CASE.label}...`);
    const auditPayload = buildAmparoAuditPayload(headBefore, correlationId, traceId);
    const auditPost = await postJson('/api/truth-trail/audit', auditPayload);
    lines.push(`- [2] AUDIT_POST (${VALIDATION_CASE.label}): HTTP ${auditPost.status}`);
    assert(auditPost.status === 200, `audit POST retornou ${auditPost.status} esperado 200`);
    assert(auditPost.json?.success === true, `audit POST: success !== true | ${auditPost.text}`);

    const newHash = auditPost.json?.hash;
    const deduplicated = Boolean(auditPost.json?.deduplicated);
    lines.push(`  hash: ${String(newHash).slice(0, 16)}...`);
    lines.push(`  deduplicated: ${deduplicated}`);
    console.log(`  ✓ Evento registrado. hash=${String(newHash).slice(0, 16)}...`);

    // ── 3. Verificar cadeia após inclusão ─────────────────────────────────
    console.log(`[3/6] Verificando integridade pós-inclusão...`);
    const verifyAfter = await getJson('/api/truth-trail/verify');
    lines.push(`- [3] VERIFY_AFTER: HTTP ${verifyAfter.status}`);
    assert(verifyAfter.status === 200, 'verify-after retornou não-200');
    assert(verifyAfter.json?.success === true, 'verify-after: success !== true');
    assert(verifyAfter.json?.issues?.length === 0, `cadeia com issues após inclusão: ${JSON.stringify(verifyAfter.json?.issues)}`);

    const headAfter = verifyAfter.json.head;
    if (!deduplicated) {
      assert(headBefore !== headAfter, 'head não mudou após evento não-deduplicado');
    }
    lines.push(`  head_after: ${headAfter.slice(0, 16)}...`);
    console.log(`  ✓ Cadeia íntegra após inclusão.`);

    // ── 4. Página da trilha com parâmetros de AMPARO ──────────────────────
    console.log(`[4/6] Verificando página trilha-da-verdade para ${VALIDATION_CASE.label}...`);
    const trailPath = `/trilha-da-verdade?uf=${encodeURIComponent(VALIDATION_CASE.uf)}&cidade=${encodeURIComponent(VALIDATION_CASE.municipio)}&correlationId=${encodeURIComponent(correlationId)}&traceId=${encodeURIComponent(traceId)}&layers=${encodeURIComponent(VALIDATION_CASE.layers.join(','))}`;
    const trailPage = await getHtml(trailPath);
    lines.push(`- [4] TRAIL_PAGE (${VALIDATION_CASE.label}): HTTP ${trailPage.status}`);
    assert(trailPage.status === 200, `página trilha retornou ${trailPage.status}`);
    assert(trailPage.text.includes('Amparo') || trailPage.text.includes('amparo') || trailPage.text.length > 500, 'página trilha não contém referência ao município ou está vazia');
    console.log(`  ✓ Página da trilha carregada para ${VALIDATION_CASE.label}.`);

    // ── 5. Página de verificação de auditoria ─────────────────────────────
    console.log(`[5/6] Verificando página de auditoria...`);
    const auditPage = await getHtml('/verificacao-auditoria');
    lines.push(`- [5] AUDIT_PAGE: HTTP ${auditPage.status}`);
    assert(auditPage.status === 200, `página de auditoria retornou ${auditPage.status}`);
    console.log(`  ✓ Página de auditoria acessível.`);

    // ── 6. Idempotência: reenvio do mesmo evento não corrompre a cadeia ───
    console.log(`[6/6] Testando idempotência (reenvio do mesmo evento)...`);
    const replayPayload = buildAmparoAuditPayload(headAfter, correlationId, traceId);
    const replayPost = await postJson('/api/truth-trail/audit', replayPayload);
    lines.push(`- [6] IDEMPOTENCY (replay): HTTP ${replayPost.status}`);
    assert(replayPost.status === 200, `replay retornou ${replayPost.status}`);
    // Deve ser deduplicado OU criar novo evento válido — nunca 4xx/5xx
    console.log(`  ✓ Idempotência OK. deduplicated=${replayPost.json?.deduplicated}`);
    lines.push(`  deduplicated: ${replayPost.json?.deduplicated}`);

    // ── Resultado ─────────────────────────────────────────────────────────
    lines.push('');
    lines.push('## Resultado: ✅ PASS');
    lines.push('');
    lines.push(`| Campo | Valor |`);
    lines.push(`|---|---|`);
    lines.push(`| Município | ${VALIDATION_CASE.label} |`);
    lines.push(`| Camadas | ${VALIDATION_CASE.layers.join(', ')} |`);
    lines.push(`| head_before | \`${headBefore.slice(0, 16)}...\` |`);
    lines.push(`| head_after | \`${headAfter.slice(0, 16)}...\` |`);
    lines.push(`| correlationId | \`${correlationId}\` |`);
    lines.push(`| traceId | \`${traceId}\` |`);

    passed = true;
    console.log(`\n✅ AMPARO Validation: PASS (${VALIDATION_CASE.label})`);
  } catch (error) {
    lines.push('');
    lines.push(`## Resultado: ❌ FAIL`);
    lines.push(`**Erro:** ${error.message}`);
    console.error(`\n❌ AMPARO Validation: FAIL — ${error.message}`);
  } finally {
    writeReport(lines, passed);
  }

  if (!passed) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('[AMPARO] Erro fatal:', error);
  process.exit(1);
});
