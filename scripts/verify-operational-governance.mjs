import {readFileSync, existsSync} from 'node:fs';

const requiredFiles = [
  'governance/MANIFESTO-OPERACIONAL.yaml',
  'governance/RACI-OPERACAO.yaml',
  'governance/SLO-RUNBOOK.yaml'
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkManifest(content) {
  const requiredTokens = [
    'required_gates:',
    'governance:verify',
    'principles:',
    'resilience:'
  ];

  for (const token of requiredTokens) {
    assert(content.includes(token), `MANIFESTO missing token: ${token}`);
  }
}

function checkRaci(content) {
  const requiredTokens = [
    'roles:',
    'matrix:',
    'accountable:',
    'responsible:'
  ];

  for (const token of requiredTokens) {
    assert(content.includes(token), `RACI missing token: ${token}`);
  }
}

function checkSlo(content) {
  const requiredTokens = [
    'sli:',
    'slo:',
    'error_budget:',
    'incident_response:',
    'truth_trail_integrity:',
    'scripts/smoke-truth-trail.mjs',
    'validate_truth_trail_verify_and_audit_post'
  ];

  for (const token of requiredTokens) {
    assert(content.includes(token), `SLO runbook missing token: ${token}`);
  }
}

function main() {
  for (const file of requiredFiles) {
    assert(existsSync(file), `Missing required governance artifact: ${file}`);
  }

  const manifesto = readFileSync(requiredFiles[0], 'utf8');
  const raci = readFileSync(requiredFiles[1], 'utf8');
  const slo = readFileSync(requiredFiles[2], 'utf8');

  checkManifest(manifesto);
  checkRaci(raci);
  checkSlo(slo);

  console.log('Operational governance check: OK');
}

try {
  main();
} catch (error) {
  console.error(`Operational governance check failed: ${error.message}`);
  process.exit(1);
}
