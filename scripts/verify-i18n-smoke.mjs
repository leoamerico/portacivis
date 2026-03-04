const baseUrl = process.env.BASE_URL || 'https://www.portacivis.com.br';

async function getPage(path, cookie) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: cookie ? {Cookie: cookie} : {},
    redirect: 'follow'
  });

  const html = await response.text();
  return {status: response.status, html};
}

function assertIncludes(html, needle, label) {
  if (!html.includes(needle)) {
    throw new Error(`Missing expected text (${label}): ${needle}`);
  }
}

async function main() {
  const checks = [
    {
      path: '/',
      cookie: '',
      expected: 'Pular para o conteúdo principal',
      label: 'pt-BR home'
    },
    {
      path: '/agentes',
      cookie: 'PORTACIVIS_LOCALE=en-US',
      expected: 'How they work',
      label: 'en-US agents'
    },
    {
      path: '/privacidade',
      cookie: 'PORTACIVIS_LOCALE=es-ES',
      expected: 'Política de Privacidad',
      label: 'es-ES privacy'
    }
  ];

  for (const check of checks) {
    const result = await getPage(check.path, check.cookie);
    if (result.status < 200 || result.status >= 400) {
      throw new Error(`HTTP check failed (${check.label}) status=${result.status}`);
    }

    assertIncludes(result.html, check.expected, check.label);
    console.log(`i18n smoke: OK (${check.label})`);
  }
}

main().catch((error) => {
  console.error(`i18n smoke failed: ${error.message}`);
  process.exit(1);
});
