const canonicalUrl = process.env.CANONICAL_URL || 'https://www.portacivis.com.br';

async function check(url) {
  const response = await fetch(url, {
    method: 'GET',
    redirect: 'manual',
  });

  return {
    status: response.status,
    location: response.headers.get('location'),
  };
}

async function main() {
  const result = await check(canonicalUrl);

  if (result.status < 200 || result.status >= 400) {
    throw new Error(`Canonical URL health check failed (${canonicalUrl}) status=${result.status}`);
  }

  console.log(`Smoke check: OK (${canonicalUrl}) status=${result.status}`);
}

main().catch((error) => {
  console.error(`Smoke check failed: ${error.message}`);
  process.exit(1);
});
