'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';

const storageKey = 'portacivis.consent.v1';

type ConsentMode = 'essential-only' | 'anonymous-research';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations('consent');

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
    <section className="consent-banner" aria-label={t('aria')}>
      <p>
        {t('text')}{' '}
        <Link href="/privacidade">{t('privacy')}</Link> {t('and')}{' '}
        <Link href="/cookies-e-cache">{t('cookies')}</Link>.
      </p>
      <div className="consent-actions">
        <button type="button" onClick={() => setConsent('essential-only')}>
          {t('essential')}
        </button>
        <button type="button" onClick={() => setConsent('anonymous-research')}>
          {t('anonymous')}
        </button>
      </div>
    </section>
  );
}
