'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const storageKey = 'portacivis.consent.v1';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(storageKey);
    setVisible(!consent);
  }, []);

  function setConsent(value: 'accepted' | 'essential-only') {
    localStorage.setItem(storageKey, value);
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <section className="consent-banner" aria-label="Consentimento de privacidade">
      <p>
        Utilizamos apenas dados estritamente necessários para operação e segurança do portal. Saiba
        mais em <Link href="/privacidade">Política de Privacidade</Link>.
      </p>
      <div className="consent-actions">
        <button type="button" onClick={() => setConsent('essential-only')}>
          Apenas essenciais
        </button>
        <button type="button" onClick={() => setConsent('accepted')}>
          Concordo
        </button>
      </div>
    </section>
  );
}
