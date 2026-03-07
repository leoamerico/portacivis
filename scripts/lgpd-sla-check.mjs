import {readFileSync, existsSync} from 'node:fs';

const REQUESTS_FILE = 'governance/audit/lgpd-requests.json';
const ALERT_THRESHOLD_DAYS = 10;
const DEADLINE_DAYS = 15;

function main() {
  if (!existsSync(REQUESTS_FILE)) {
    console.log('LGPD SLA check: No requests log found. Skipping.');
    return;
  }

  const raw = readFileSync(REQUESTS_FILE, 'utf8');
  const log = JSON.parse(raw);
  const requests = Array.isArray(log.requests) ? log.requests : [];

  const now = new Date();
  const overdueRequests = [];
  const nearingDeadlineRequests = [];

  for (const req of requests) {
    if (req.status === 'completed' || req.status === 'rejected') continue;

    const requestDate = new Date(req.date);
    const deadline = new Date(req.deadline);
    const daysElapsed = Math.floor((now - requestDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    if (now > deadline) {
      overdueRequests.push({...req, daysElapsed, daysRemaining: 0});
    } else if (daysElapsed >= ALERT_THRESHOLD_DAYS) {
      nearingDeadlineRequests.push({...req, daysElapsed, daysRemaining});
    }
  }

  const total = requests.length;
  const pending = requests.filter(r => r.status === 'pending' || r.status === 'in_progress').length;
  const completed = requests.filter(r => r.status === 'completed').length;

  const slaRate = total > 0
    ? ((completed / total) * 100).toFixed(2)
    : '100.00';

  console.log('=== LGPD SLA Report ===');
  console.log(`Total requests: ${total}`);
  console.log(`Pending/In-progress: ${pending}`);
  console.log(`Completed: ${completed}`);
  console.log(`SLA rate: ${slaRate}%`);
  console.log(`SLA target: 95% of requests responded in < ${DEADLINE_DAYS} days`);

  if (nearingDeadlineRequests.length > 0) {
    console.log(`\nWARNING: ${nearingDeadlineRequests.length} request(s) nearing deadline (>= ${ALERT_THRESHOLD_DAYS} days elapsed):`);
    for (const req of nearingDeadlineRequests) {
      console.log(`  - ${req.id} (${req.rightType}): ${req.daysElapsed} days elapsed, ${req.daysRemaining} days remaining`);
    }
  }

  if (overdueRequests.length > 0) {
    console.error(`\nERROR: ${overdueRequests.length} overdue request(s) past 15-day legal deadline:`);
    for (const req of overdueRequests) {
      console.error(`  - ${req.id} (${req.rightType}): ${req.daysElapsed} days elapsed — OVERDUE`);
    }
    console.error('\nLGPD SLA check: FAILED — overdue requests require immediate DPO action.');
    process.exit(1);
  }

  if (nearingDeadlineRequests.length > 0) {
    console.error('\nLGPD SLA check: FAILED — requests nearing deadline require DPO attention.');
    process.exit(1);
  }

  console.log('\nLGPD SLA check: OK');
}

try {
  main();
} catch (error) {
  console.error(`LGPD SLA check failed: ${error.message}`);
  process.exit(1);
}
