'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const storageKey = 'portacivis.consent.v1';

type ConsentMode = 'essential-only' | 'anonymous-research';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(storageKey);
    setVisible(!consent);
  }, []);

  function setConsent(value: ConsentMode) {
    localStorage.setItem(storageKey, value);
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <section className="consent-banner" aria-label="Consentimento de privacidade">
      <p>
        Utilizamos apenas dados estritamente necessários para operação e segurança do portal. A
        pesquisa de uso é sempre anônima, opcional e sem perfilamento sensível. Saiba mais em{' '}
        <Link href="/privacidade">Política de Privacidade</Link> e{' '}
        <Link href="/cookies-e-cache">Política de Cookies e Cache</Link>.
      </p>
      <div className="consent-actions">
        <button type="button" onClick={() => setConsent('essential-only')}>
          Apenas essenciais
        </button>
        <button type="button" onClick={() => setConsent('anonymous-research')}>
          Permitir pesquisa anônima
        </button>
      </div>
    </section>
  );
}
