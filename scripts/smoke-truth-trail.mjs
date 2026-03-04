import {mkdirSync, writeFileSync} from 'node:fs';
import {createHash, randomUUID} from 'node:crypto';

const baseUrl = process.env.BASE_URL || 'https://www.portacivis.com.br';

function nowIso() {
  return new Date().toISOString();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function randomId(prefix) {
  return `${prefix}-${Math.random().toString(16).slice(2, 10)}`;
}

function sha256Hex(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function getJson(path, cookie) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: cookie ? {Cookie: cookie} : {},
    redirect: 'follow'
  });

  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  return {status: response.status, text, json};
}

async function postJson(path, payload) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
    redirect: 'follow'
  });

  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  return {status: response.status, text, json};
}

async function getHtml(path, cookie) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: cookie ? {Cookie: cookie} : {},
    redirect: 'follow'
  });

  const text = await response.text();
  return {status: response.status, text};
}

function buildAuditPayload(previousHash) {
  const payload = {
    source: 'truth-trail-smoke',
    scope: 'post-deploy-validation',
    timestamp: nowIso()
  };

  return {
    eventId: randomUUID(),
    eventType: 'TRUTH_TRAIL_ENTRY',
    actorId: 'visitor-anonymous',
    delegationContext: 'smoke-validation',
    delegationId: 'self',
    timestamp: nowIso(),
    action: 'view_truth_trail',
    payload,
    payloadHash: sha256Hex(JSON.stringify(payload)),
    correlationId: randomId('corr'),
    traceId: randomId('trace'),
    classification: 'publico',
    previousHash
  };
}

function writeReport(lines) {
  mkdirSync('reports/runtime', {recursive: true});
  writeFileSync('reports/runtime/SMOKE-TRUTH-TRAIL-LAST.md', `${lines.join('\n')}\n`, 'utf8');
}

async function main() {
  const lines = [
    '# SMOKE-TRUTH-TRAIL-LAST',
    '',
    `Data: ${nowIso()}`,
    `Base URL: ${baseUrl}`,
    ''
  ];

  try {
    const verifyBefore = await getJson('/api/truth-trail/verify');
    lines.push(`- VERIFY_BEFORE status: ${verifyBefore.status}`);
    assert(verifyBefore.status === 200, 'verify endpoint returned non-200');
    assert(verifyBefore.json?.success === true, 'verify endpoint did not return success=true');
    assert(Array.isArray(verifyBefore.json?.issues), 'verify endpoint issues is not an array');
    assert(verifyBefore.json.issues.length === 0, 'verify endpoint returned issues before audit');
    assert(typeof verifyBefore.json?.head === 'string' && verifyBefore.json.head.length > 0, 'verify endpoint head is missing');

    const auditPayload = buildAuditPayload(verifyBefore.json.head);
    const auditPost = await postJson('/api/truth-trail/audit', auditPayload);
    lines.push(`- AUDIT_POST status: ${auditPost.status}`);
    assert(auditPost.status === 200, 'audit endpoint returned non-200');
    assert(auditPost.json?.success === true, 'audit endpoint did not return success=true');

    const verifyAfter = await getJson('/api/truth-trail/verify');
    lines.push(`- VERIFY_AFTER status: ${verifyAfter.status}`);
    assert(verifyAfter.status === 200, 'verify-after endpoint returned non-200');
    assert(verifyAfter.json?.success === true, 'verify-after endpoint did not return success=true');
    assert(Array.isArray(verifyAfter.json?.issues), 'verify-after endpoint issues is not an array');
    assert(verifyAfter.json.issues.length === 0, 'verify-after endpoint returned issues');

    const deduplicated = Boolean(auditPost.json?.deduplicated);
    const headChanged = verifyBefore.json.head !== verifyAfter.json.head;
    lines.push(`- HEAD_CHANGED: ${headChanged}`);
    if (!deduplicated) {
      assert(headChanged, 'head did not change after non-deduplicated audit post');
    }

    const pagePt = await getHtml('/verificacao-auditoria');
    const pageEn = await getHtml('/verificacao-auditoria', 'PORTACIVIS_LOCALE=en-US');
    const pageEs = await getHtml('/verificacao-auditoria', 'PORTACIVIS_LOCALE=es-ES');

    lines.push(`- PAGE_PT status: ${pagePt.status}`);
    lines.push(`- PAGE_EN status: ${pageEn.status}`);
    lines.push(`- PAGE_ES status: ${pageEs.status}`);

    assert(pagePt.status === 200, 'pt-BR verification page returned non-200');
    assert(pageEn.status === 200, 'en-US verification page returned non-200');
    assert(pageEs.status === 200, 'es-ES verification page returned non-200');
    assert(pagePt.text.includes('Verificação da cadeia de auditoria'), 'pt-BR title not found');
    assert(pageEn.text.includes('Audit chain verification'), 'en-US title not found');
    assert(pageEs.text.includes('Verificación de la cadena de auditoría'), 'es-ES title not found');

    lines.push('', 'Resultado: PASS');
    writeReport(lines);
    console.log('Truth Trail smoke: PASS');
  } catch (error) {
    lines.push('', `Resultado: FAIL`, `Erro: ${error.message}`);
    writeReport(lines);
    console.error(`Truth Trail smoke: FAIL - ${error.message}`);
    process.exit(1);
  }
}

main();