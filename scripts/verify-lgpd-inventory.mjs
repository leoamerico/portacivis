import {readFileSync, existsSync} from 'node:fs';

const INVENTORY_FILE = 'governance/LGPD-DATA-INVENTORY.yaml';
const MAX_STALENESS_DAYS = 90;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkInventorySchema(content) {
  const requiredTokens = [
    'version:',
    'updated_at:',
    'data_controller:',
    'dpo_email:',
    'personal_data_categories:',
    'legal_basis:',
    'purpose:',
    'retention_days:',
    'security_measures:',
    'lgpd_rights_channels:'
  ];

  for (const token of requiredTokens) {
    assert(content.includes(token), `LGPD inventory missing required field: ${token}`);
  }
}

function checkInventoryFreshness(content) {
  const match = content.match(/updated_at:\s*["']?(\d{4}-\d{2}-\d{2})["']?/);
  assert(match, 'LGPD inventory missing or invalid updated_at field');

  const updatedAt = new Date(match[1]);
  const now = new Date();
  const diffMs = now - updatedAt;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  assert(
    diffDays <= MAX_STALENESS_DAYS,
    `LGPD inventory is stale: last updated ${diffDays} days ago (max ${MAX_STALENESS_DAYS} days). ` +
    `Update governance/LGPD-DATA-INVENTORY.yaml and set updated_at to today.`
  );

  console.log(`  Inventory freshness: OK (updated ${diffDays} days ago)`);
}

function checkDpoContact(content) {
  assert(
    content.includes('dpo_email:'),
    'LGPD inventory missing dpo_email in data_controller'
  );
  assert(
    /dpo_email:\s*["']?dpo@/.test(content),
    'LGPD inventory dpo_email must be a valid DPO email address starting with dpo@'
  );
}

function main() {
  assert(existsSync(INVENTORY_FILE), `Missing required LGPD artifact: ${INVENTORY_FILE}`);

  const content = readFileSync(INVENTORY_FILE, 'utf8');

  checkInventorySchema(content);
  checkDpoContact(content);
  checkInventoryFreshness(content);

  console.log('LGPD inventory validation: OK');
}

try {
  main();
} catch (error) {
  console.error(`LGPD inventory validation failed: ${error.message}`);
  process.exit(1);
}
